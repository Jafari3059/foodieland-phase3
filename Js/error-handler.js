function getErrorMessage(error) {
    // خطای Timeout
    if (error.name === 'AbortError') {
        return 'The server is taking too long. Please try again later.';
    }

    // خطای شبکه (قطع اینترنت)
    if (error instanceof TypeError ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')) {
        return 'No internet connection. Please check your network.';
    }

    // خطای سرور (۴۰۴، ۵۰۰، ...)
    if (error.message.includes('Server Error') || error.message.includes('HTTP_')) {
        return 'The server is currently unavailable. Please try again later.';
    }

    // خطای ناشناخته
    return 'Something went wrong. Please refresh the page.';
}