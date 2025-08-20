import axios from 'axios';

// 환경 변수에서 API URL 가져오기
const getApiBaseUrl = (): string => {
    // Vite 환경 변수 사용
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (envUrl) {
        return envUrl;
    }
    
    // 환경 변수가 없는 경우 기본값
    if (import.meta.env.PROD) {
        // 프로덕션 환경: 현재 호스트의 8080 포트 사용 (HTTPS 적용)
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        return `${protocol}//${hostname}:8080`;
    } else {
        // 개발 환경: localhost 사용
        return 'http://localhost:8080';
    }
};

const BASE_URL = getApiBaseUrl();
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const IS_DEVELOPMENT = import.meta.env.DEV;

// axios 인스턴스 생성
const api = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 개발 환경에서만 로그 출력
const devLog = (message: string, ...args: any[]) => {
    if (IS_DEVELOPMENT) {
        console.log(`[API] ${message}`, ...args);
    }
};

const devError = (message: string, ...args: any[]) => {
    if (IS_DEVELOPMENT) {
        console.error(`[API Error] ${message}`, ...args);
    }
};

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const tempToken = localStorage.getItem('tempToken');
        
        // accessToken이 있으면 우선 사용, 없으면 tempToken 사용
        const token = accessToken || tempToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 인증 관련 에러 처리
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tempToken');
            localStorage.removeItem('userInfo');
            
            // 인증 실패 시 커스텀 이벤트 발생
            window.dispatchEvent(new CustomEvent('authChange'));
        }
        
        // 네트워크 에러나 서버 에러에 대한 추가 정보
        if (!error.response) {
            // 네트워크 에러
            error.message = '네트워크 연결을 확인해주세요.';
        } else if (error.response.status >= 500) {
            // 서버 에러
            error.message = '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.response.status === 403) {
            // 권한 에러
            error.message = '해당 작업을 수행할 권한이 없습니다.';
        } else if (error.response.status === 404) {
            // 리소스 없음
            error.message = '요청한 리소스를 찾을 수 없습니다.';
        }
        
        return Promise.reject(error);
    }
);

// CRUD 함수들
export const apiClient = {
    // GET 요청
    get: async <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> => {
        try {
            devLog(`GET 요청: ${url}`, params);
            const response = await api.get(url, {params});
            devLog(`GET 응답: ${url}`, response.data);
            return response.data as T;
        } catch (error) {
            devError(`GET 요청 실패: ${url}`, error);
            throw error;
        }
    },

    // POST 요청
    post: async <T = unknown>(url: string, data?: any): Promise<T> => {
        try {
            devLog(`POST 요청: ${url}`, data);
            const response = await api.post(url, data);
            devLog(`POST 응답: ${url}`, response.data);
            return response.data as T;
        } catch (error) {
            devError(`POST 요청 실패: ${url}`, error);
            throw error;
        }
    },

    // PUT 요청
    put: async <T = unknown>(url: string, data?: any): Promise<T> => {
        try {
            devLog(`PUT 요청: ${url}`, data);
            const response = await api.put(url, data);
            devLog(`PUT 응답: ${url}`, response.data);
            return response.data as T;
        } catch (error) {
            devError(`PUT 요청 실패: ${url}`, error);
            throw error;
        }
    },

    // DELETE 요청
    delete: async (url: string) => {
        try {
            devLog(`DELETE 요청: ${url}`);
            const response = await api.delete(url);
            devLog(`DELETE 응답: ${url}`, response.data);
            return response.data;
        } catch (error) {
            devError(`DELETE 요청 실패: ${url}`, error);
            throw error;
        }
    }
};

// API 설정 정보 노출 (개발 환경에서만)
if (IS_DEVELOPMENT) {
    console.log('[API 설정]', {
        baseURL: BASE_URL,
        timeout: API_TIMEOUT,
        environment: import.meta.env.MODE
    });
};
