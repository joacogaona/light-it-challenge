
function ErrorMessage({ message }: { message: string }) {
    return <p role="alert" className="text-start animate-bounce-short text-rose-600">{message}</p>
}

export default ErrorMessage