import React from 'react';
import { Modal } from '@/components/ui/Modal';

interface FeedbackModalProps {
  isOpen: boolean;
  feedback: string;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, feedback, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feedback und Analyse"
      description="Hier ist das Feedback zu Ihrer Leistung:"
    >
      <pre className="whitespace-pre-wrap">{feedback}</pre>
    </Modal>
  );
};

export default FeedbackModal;