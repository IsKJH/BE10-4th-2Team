import Swal from 'sweetalert2';

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#4F46E5',
    confirmButtonText: '확인',
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#EF4444',
    confirmButtonText: '확인',
  });
};

export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonColor: '#F59E0B',
    confirmButtonText: '확인',
  });
};

export const showConfirmAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'question',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#4F46E5',
    cancelButtonColor: '#6B7280',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
  });
};

export const showDeleteConfirmAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
  });
};

export const showLoadingAlert = (title: string) => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const hideLoadingAlert = () => {
  Swal.close();
};