import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommunicationSession {
  id: string;
  session_type: 'video' | 'audio' | 'screen_share';
  participants: any[];
  session_data: Record<string, any>;
  started_at: string;
  ended_at?: string;
  metrics: {
    bandwidth_usage: number[];
    quality_metrics: Record<string, any>;
    participant_stats: any[];
  };
}

class CommunicationService {
  private peerConnection?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;
  private localStream?: MediaStream;
  private sessionId?: string;

  constructor() {
    console.log('🎥 Initializing CommunicationService');
  }

  async initializeSession(type: 'video' | 'audio' | 'screen_share'): Promise<string> {
    try {
      console.log(`🎥 Initializing ${type} session`);
      
      const { data: session, error } = await supabase
        .from('communication_sessions')
        .insert({
          session_type: type,
          participants: [],
          session_data: {},
          metrics: {
            bandwidth_usage: [],
            quality_metrics: {},
            participant_stats: []
          }
        })
        .select()
        .single();

      if (error) throw error;

      this.sessionId = session.id;
      console.log('🎥 Session created:', session.id);
      
      await this.setupWebRTC();
      
      return session.id;
    } catch (error) {
      console.error('🔴 Failed to initialize session:', error);
      toast.error('Failed to initialize communication session');
      throw error;
    }
  }

  private async setupWebRTC() {
    try {
      console.log('🎥 Setting up WebRTC');
      
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };

      this.peerConnection = new RTCPeerConnection(configuration);
      
      // Setup data channel for messaging
      this.dataChannel = this.peerConnection.createDataChannel('messaging');
      this.setupDataChannelHandlers();

      // Log connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('🎥 Connection state:', this.peerConnection?.connectionState);
      };

      // Handle ICE candidates
      this.peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          await this.updateSessionData({ iceCandidate: event.candidate });
        }
      };

      console.log('🎥 WebRTC setup complete');
    } catch (error) {
      console.error('🔴 WebRTC setup failed:', error);
      throw error;
    }
  }

  private setupDataChannelHandlers() {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('🎥 Data channel opened');
    };

    this.dataChannel.onclose = () => {
      console.log('🎥 Data channel closed');
    };

    this.dataChannel.onmessage = (event) => {
      console.log('🎥 Message received:', event.data);
    };
  }

  private async updateSessionData(data: Record<string, any>) {
    if (!this.sessionId) return;

    try {
      const { error } = await supabase
        .from('communication_sessions')
        .update({
          session_data: data
        })
        .eq('id', this.sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('🔴 Failed to update session data:', error);
    }
  }

  async startLocalStream(type: 'video' | 'audio' | 'screen_share'): Promise<MediaStream> {
    try {
      console.log(`🎥 Starting ${type} stream`);
      
      let constraints: MediaStreamConstraints = {
        audio: true,
        video: type === 'video'
      };

      if (type === 'screen_share') {
        // @ts-ignore - TypeScript doesn't recognize getDisplayMedia
        this.localStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
      } else {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      console.log('🎥 Local stream started');
      return this.localStream;
    } catch (error) {
      console.error('🔴 Failed to start local stream:', error);
      toast.error('Failed to access media devices');
      throw error;
    }
  }

  async endSession() {
    try {
      console.log('🎥 Ending session');
      
      // Stop all tracks
      this.localStream?.getTracks().forEach(track => track.stop());
      
      // Close peer connection
      this.peerConnection?.close();
      
      if (this.sessionId) {
        const { error } = await supabase
          .from('communication_sessions')
          .update({
            ended_at: new Date().toISOString()
          })
          .eq('id', this.sessionId);

        if (error) throw error;
      }

      console.log('🎥 Session ended');
    } catch (error) {
      console.error('🔴 Failed to end session:', error);
      toast.error('Failed to end session properly');
    }
  }
}

export const communicationService = new CommunicationService();