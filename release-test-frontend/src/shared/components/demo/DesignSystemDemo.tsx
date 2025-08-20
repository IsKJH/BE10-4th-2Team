import React, { useState } from 'react';
import { Button, Input, Textarea } from '@/shared/components/ui';

const DesignSystemDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Design System Demo</h1>
                    <p className="text-lg text-gray-600">우리 프로젝트의 디자인 시스템 컴포넌트들</p>
                </div>

                {/* Button Examples */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Buttons</h2>
                    
                    <div className="space-y-6">
                        {/* Button Variants */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Variants</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="warning">Warning</Button>
                                <Button variant="danger">Danger</Button>
                                <Button variant="ghost">Ghost</Button>
                            </div>
                        </div>

                        {/* Button Sizes */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button variant="primary" size="sm">Small</Button>
                                <Button variant="primary" size="md">Medium</Button>
                                <Button variant="primary" size="lg">Large</Button>
                            </div>
                        </div>

                        {/* Loading & Disabled States */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-4">States</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
                                    {loading ? 'Loading...' : 'Click for Loading'}
                                </Button>
                                <Button variant="secondary" disabled>Disabled</Button>
                                <Button variant="primary" fullWidth>Full Width</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Input Examples */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Inputs</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <Input
                                label="기본 입력"
                                placeholder="텍스트를 입력하세요"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                fullWidth
                            />

                            <Input
                                label="이메일"
                                type="email"
                                placeholder="email@example.com"
                                variant="filled"
                                fullWidth
                            />

                            <Input
                                label="비밀번호"
                                type="password"
                                placeholder="비밀번호 입력"
                                variant="bordered"
                                required
                                fullWidth
                            />

                            <Input
                                label="에러 상태"
                                placeholder="에러가 있는 입력"
                                error="이 필드는 필수입니다"
                                fullWidth
                            />
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="도움말 포함"
                                placeholder="도움말이 있는 입력"
                                helpText="이 입력에 대한 도움말입니다"
                                fullWidth
                            />

                            <Input
                                label="비활성화"
                                placeholder="비활성화된 입력"
                                disabled
                                fullWidth
                            />

                            <Textarea
                                label="긴 텍스트"
                                placeholder="여러 줄 텍스트를 입력하세요..."
                                value={textareaValue}
                                onChange={(e) => setTextareaValue(e.target.value)}
                                rows={4}
                                fullWidth
                            />

                            <div className="flex gap-3">
                                <Input size="sm" placeholder="Small" />
                                <Input size="md" placeholder="Medium" />
                                <Input size="lg" placeholder="Large" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Color Palette */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Color Palette</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Primary Colors */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Primary</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-primary rounded-lg shadow-sm flex items-center justify-center text-white font-medium">
                                    Primary
                                </div>
                                <div className="text-xs text-gray-500">var(--primary-500)</div>
                            </div>
                        </div>

                        {/* Secondary Colors */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Secondary</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-secondary rounded-lg shadow-sm flex items-center justify-center text-white font-medium">
                                    Secondary
                                </div>
                                <div className="text-xs text-gray-500">var(--secondary-500)</div>
                            </div>
                        </div>

                        {/* Success Colors */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Success</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-success rounded-lg shadow-sm flex items-center justify-center text-white font-medium">
                                    Success
                                </div>
                                <div className="text-xs text-gray-500">var(--success-500)</div>
                            </div>
                        </div>

                        {/* Danger Colors */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Danger</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-danger rounded-lg shadow-sm flex items-center justify-center text-white font-medium">
                                    Danger
                                </div>
                                <div className="text-xs text-gray-500">var(--danger-500)</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Utility Classes */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Utility Classes</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Typography</h3>
                            <div className="space-y-2">
                                <p className="text-primary">Primary Text</p>
                                <p className="text-secondary">Secondary Text</p>
                                <p className="text-success">Success Text</p>
                                <p className="text-warning">Warning Text</p>
                                <p className="text-danger">Danger Text</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Shadows</h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-white shadow-sm rounded-lg">Small Shadow</div>
                                <div className="p-4 bg-white shadow-md rounded-lg">Medium Shadow</div>
                                <div className="p-4 bg-white shadow-lg rounded-lg">Large Shadow</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Border Radius</h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-white border rounded-sm">Small Radius</div>
                                <div className="p-4 bg-white border rounded-lg">Medium Radius</div>
                                <div className="p-4 bg-white border rounded-xl">Large Radius</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DesignSystemDemo;