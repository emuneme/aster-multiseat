import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
                    <div className="max-w-md text-center space-y-4">
                        <div className="flex justify-center">
                            <i className="w-16 h-16 rounded-full bg-error/20 text-error flex items-center justify-center text-3xl">
                                ⚠️
                            </i>
                        </div>
                        <h1 className="text-3xl font-bold text-base-content">Ups! Algo correu mal.</h1>
                        <p className="text-base-content/70">
                            Pedimos desculpa pelo incómodo. Encontrámos um erro inesperado.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/';
                            }}
                        >
                            Voltar ao Início
                        </button>

                        {/* Only show error details in development or local */}
                        {import.meta.env.MODE !== 'production' && this.state.error && (
                            <div className="mt-8 text-left bg-base-200 p-4 rounded-xl overflow-auto text-xs font-mono">
                                <p className="text-error font-bold mb-2">{this.state.error.toString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
