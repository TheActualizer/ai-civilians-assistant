import { supabase } from '@/integrations/supabase/client';
import type { CommunicationSession } from '@/types/agent';

class CommunicationService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;

  async createSession(sessionType: 'video' | 'audio' | 'screen_share'): Promise<CommunicationSession> {
    try {
      console.log('Creating new communication session:', { sessionType });
      
      const { data, error } = await supabase
        .from('communication_sessions')
        .insert({
          session_type: sessionType,
          participants: [],
          session_data: {
            settings: {
              video: sessionType === 'video',
              audio: true,
              screen: sessionType === 'screen_share'
            }
          }
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Communication session created:', data);
      return data as CommunicationSession;
    } catch (error) {
      console.error('Error creating communication session:', error);
      throw error;
    }
  }

  async joinSession(sessionId: string, participantId: string): Promise<void> {
    try {
      console.log('Joining communication session:', { sessionId, participantId });
      
      const { data: session, error } = await supabase
        .from('communication_sessions')
        .select()
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      const participants = [...(session.participants || []), participantId];
      
      await supabase
        .from('communication_sessions')
        .update({ participants })
        .eq('id', sessionId);

      // Initialize WebRTC connection
      await this.initializeWebRTC(sessionId, participantId, session.session_type);
      
      console.log('Successfully joined session:', { sessionId, participantId });
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }

  private async initializeWebRTC(sessionId: string, participantId: string, sessionType: string): Promise<void> {
    try {
      console.log('Initializing WebRTC:', { sessionId, participantId, sessionType });
      
      const constraints: MediaStreamConstraints = {
        video: sessionType === 'video',
        audio: true
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      this.peerConnections.set(participantId, peerConnection);

      // Add local tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          peerConnection.addTrack(track, this.localStream);
        }
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          this.broadcastIceCandidate(sessionId, participantId, event.candidate);
        }
      };

      // Handle incoming tracks
      peerConnection.ontrack = event => {
        console.log('Received remote track:', event);
        // Handle remote media stream
      };

      console.log('WebRTC initialized successfully');
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }

  private async broadcastIceCandidate(
    sessionId: string, 
    participantId: string, 
    candidate: RTCIceCandidate
  ): Promise<void> {
    try {
      await supabase.from('communication_sessions').update({
        session_data: {
          ice_candidates: {
            [participantId]: candidate
          }
        }
      }).eq('id', sessionId);
    } catch (error) {
      console.error('Error broadcasting ICE candidate:', error);
    }
  }

  async leaveSession(sessionId: string, participantId: string): Promise<void> {
    try {
      console.log('Leaving session:', { sessionId, participantId });
      
      // Cleanup WebRTC
      const peerConnection = this.peerConnections.get(participantId);
      if (peerConnection) {
        peerConnection.close();
        this.peerConnections.delete(participantId);
      }

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // Update session in database
      const { data: session, error } = await supabase
        .from('communication_sessions')
        .select()
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      const participants = (session.participants || []).filter(id => id !== participantId);
      
      await supabase
        .from('communication_sessions')
        .update({ 
          participants,
          ended_at: participants.length === 0 ? new Date().toISOString() : null
        })
        .eq('id', sessionId);

      console.log('Successfully left session');
    } catch (error) {
      console.error('Error leaving session:', error);
      throw error;
    }
  }
}

export const communicationService = new CommunicationService();