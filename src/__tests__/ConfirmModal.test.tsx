import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../components/common/ConfirmModal';

describe('ConfirmModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        title="Delete Item"
        message="Are you sure?"
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title, message, and action buttons when isOpen is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        title="Delete Item"
        message="Are you sure you want to proceed?"
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        type="danger"
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Keep')).toBeInTheDocument();
  });

  it('triggers onConfirm and onClose when buttons are clicked', () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <ConfirmModal
        isOpen={true}
        title="Clear Cart"
        message="Clear all items?"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByText('Confirm'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
