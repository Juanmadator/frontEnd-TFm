import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCallback } from 'react';

const MySwal = withReactContent(Swal);

const useAlerts = () => {

  const defaultToastOptions = {  };
  const showSuccessAlert = (title, text, options = {}) => {  };
  const showErrorAlert = (title, text, options = {}) => {  };
  const showWarningAlert = (title, text, options = {}) => {  };
  const showInfoAlert = (title, text, options = {}) => {  };
  const showConfirmAlert = (title, text, options = {}) => {  };
  const showLoadingAlert = (title = 'Cargando...', text = 'Por favor espera.') => {  };
  const showToast = (icon, title, text = '', options = {}) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: icon,
    title: title,
    text: text,
    ...options,
  });
};
  const closeAlert = () => {
    Swal.close();
  };
  const formatDateForInput = (dateString) => {  };

  const showEditProfileModal = useCallback(async (currentName, currentStatus, currentNacimiento) => {
    const formattedNacimiento = currentNacimiento ? formatDateForInput(currentNacimiento) : '';

    const { value: formValues } = await MySwal.fire({
      title: 'Editar Datos Personales',
      html: `
        <style>
          .swal2-container .swal2-popup {
            background-color: #f8f9fa;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 30px;
          }

          .swal2-container .swal2-title {
            color: #343a40;
            font-weight: 600;
            margin-bottom: 25px;
            font-size: 1.8em;
          }

          .swal2-html-container {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .swal2-input-group {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }

          .swal2-input-group label {
            font-size: 1em;
            color: #495057;
            margin-bottom: 8px;
            font-weight: 500;
            text-align: left;
          }

          .swal2-input {
            border: 1px solid #ced4da;
            border-radius: 8px;
            padding: 12px 15px;
            font-size: 1.1em;
            color: #495057;
            background-color: #fff;
            width: 100%;
            box-sizing: border-box;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            text-align: left;
            margin: 0;
          }

          .swal2-input:focus {
            outline: none;
            border-color: #80bdff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="date"]::-webkit-inner-spin-button,
          input[type="date"]::-webkit-clear-button {
            display: none !important;
            -webkit-appearance: none;
          }
          input[type="date"] {
            -webkit-appearance: none;
            appearance: none;
            padding-right: 15px;
          }
          input[type="date"]::-moz-focus-inner {
            border: 0;
          }
          input[type="date"] {
            overflow: hidden;
          }
          input[type="date"]::-webkit-scrollbar {
              display: none;
          }
          input[type="date"] {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }

          .swal2-actions {
            margin-top: 30px !important;
            gap: 15px;
          }
          .swal2-confirm, .swal2-cancel {
            font-size: 1.1em !important;
            padding: 12px 25px !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease-in-out !important;
          }

          .swal2-confirm {
            background-color: #6f42c1 !important;
            border-color: #6f42c1 !important;
            color: white !important;
          }
          .swal2-confirm:hover {
            background-color: #5a34a3 !important;
          }

          .swal2-cancel {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            color: white !important;
          }
          .swal2-cancel:hover {
            background-color: #5a6268 !important;
          }

          @media (max-width: 500px) {
            .swal2-input {
              padding: 10px 12px;
              font-size: 1em;
            }
            .swal2-html-container {
              gap: 15px;
            }
            .swal2-confirm, .swal2-cancel {
              width: 100%;
              margin: 5px 0 !important;
            }
          }
        </style>
        
        <div class="swal2-input-group">
          <label for="swal-input-name">Nombre:</label>
          <input id="swal-input-name" class="swal2-input" placeholder="Tu nombre" value="${currentName || ''}">
        </div>

        <div class="swal2-input-group">
          <label for="swal-input-nacimiento">Fecha de Nacimiento:</label>
          <input id="swal-input-nacimiento" type="date" class="swal2-input" value="${formattedNacimiento}">
        </div>
        
        <div class="swal2-input-group">
          <label for="swal-input-status">Estado:</label>
          <select id="swal-input-status" class="swal2-input">
            <option value="Empleado" ${currentStatus === 'Empleado' ? 'selected' : ''}>Empleado</option>
            <option value="Desempleado" ${currentStatus === 'Desempleado' ? 'selected' : ''}>Desempleado</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nameInput = Swal.getPopup().querySelector('#swal-input-name');
        const nacimientoInput = Swal.getPopup().querySelector('#swal-input-nacimiento');
        const statusInput = Swal.getPopup().querySelector('#swal-input-status');

        if (!nameInput.value) {
          Swal.showValidationMessage('El nombre no puede estar vacío.');
          return false;
        }
        if (!nacimientoInput.value) {
          Swal.showValidationMessage('La fecha de nacimiento no puede estar vacía.');
          return false;
        }

        return {
          nombre: nameInput.value,
          nacimiento: nacimientoInput.value,
          empleado: statusInput.value,
        };
      }
    });

    return formValues;
  }, [formatDateForInput]);

  return {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    showConfirmAlert,
    showLoadingAlert,
    closeAlert,
    showToast,
    showEditProfileModal,
  };
};

export default useAlerts;
