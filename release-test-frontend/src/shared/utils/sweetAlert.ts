import Swal from 'sweetalert2';

export const showSuccessAlert = (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#10b981',
    confirmButtonText: '확인',
    timer: 3000,
    timerProgressBar: true,
    showCancelButton: false,
    ...options
  });
};

export const showErrorAlert = (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#ef4444',
    confirmButtonText: '확인',
    showCancelButton: false,
    ...options
  });
};

export const showWarningAlert = (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: '확인',
    showCancelButton: false,
    ...options
  });
};

export const showConfirmAlert = (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#0c8ce9',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    ...options
  });
};

export const showDeleteConfirmAlert = (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
    dangerMode: true,
    ...options
  });
};

export const showLoadingAlert = (title: string, options?: any) => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'swal-loading-popup'
    },
    didOpen: () => {
      Swal.showLoading();
    },
    ...options
  });
};

export const hideLoadingAlert = () => {
  Swal.close();
};

// Toast 스타일 알림 (간단한 메시지용)
export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  return Toast.fire({
    icon: type,
    title: message
  });
};

// 에러 리포트 알림
export const showErrorReportAlert = (error: Error, context?: string) => {
  const isDev = import.meta.env.DEV;
  
  return Swal.fire({
    icon: 'error',
    title: '예상치 못한 오류가 발생했습니다',
    text: '담당자에게 문의하시거나 잠시 후 다시 시도해주세요.',
    confirmButtonColor: '#ef4444',
    showCancelButton: isDev,
    cancelButtonText: isDev ? '디버그 정보 보기' : undefined,
    confirmButtonText: '확인'
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel && isDev) {
      // 개발 환경에서만 디버그 정보 표시
      Swal.fire({
        title: '디버그 정보',
        html: `
          <div style="text-align: left; font-size: 12px; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px; max-height: 300px; overflow-y: auto;">
            <strong>Context:</strong> ${context || 'Unknown'}<br/><br/>
            <strong>Error:</strong> ${error.message}<br/><br/>
            <strong>Stack:</strong><br/>
            ${error.stack?.replace(/\n/g, '<br/>') || 'No stack trace available'}
          </div>
        `,
        width: '80%',
        confirmButtonText: '닫기'
      });
    }
  });
};