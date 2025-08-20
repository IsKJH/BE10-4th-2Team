import React, { Component, ReactNode } from 'react';
import { EmptyState, Button } from '@/shared/components/ui';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // 여기에서 에러 로깅 서비스로 전송할 수 있습니다
        // 예: Sentry, LogRocket 등
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <EmptyState
                            icon={<FiAlertTriangle size={48} className="text-red-500" />}
                            title="오류가 발생했습니다"
                            description="예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요."
                            action={
                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={this.handleReset}>
                                        다시 시도
                                    </Button>
                                    <Button variant="primary" onClick={this.handleReload}>
                                        페이지 새로고침
                                    </Button>
                                </div>
                            }
                        />
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 p-4 bg-white rounded-lg border border-red-200">
                                <summary className="cursor-pointer font-semibold text-red-700">
                                    개발자 정보 (프로덕션에서는 표시되지 않음)
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-words">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;