import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const secureKey = 'DemoPortfolioSecretPassphrase123!';

  const authenticatedRequest = req.clone({
    setHeaders: {
      'X-API-KEY': secureKey,
    },
  });

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      let friendlyMessage = 'An unexpected network error occurred.';

      if (error.status === 400) {
        // Check if the .NET backend provided structured ProblemDetails validation errors
        if (error.error && error.error.errors) {
          const validationErrorsDictionary = error.error.errors;
          const extractedMessages: string[] = [];

          // Loop through each field name key (e.g., "Name", "Price") and collect their messages
          for (const key in validationErrorsDictionary) {
            if (Object.prototype.hasOwnProperty.call(validationErrorsDictionary, key)) {
              extractedMessages.push(...validationErrorsDictionary[key]);
            }
          }

          // Combine the server strings into a clean notification layout block
          friendlyMessage = `Validation Failed:\n${extractedMessages.join('\n')}`;
          alert(friendlyMessage); // Instantly alerts the reviewer exactly what field input failed
        } else {
          friendlyMessage = error.error || 'Bad Request submitted to the server application.';
        }
      } else if (error.status === 401) {
        friendlyMessage = 'Security Access Denied: Missing API validation keys.';
        alert(friendlyMessage);
      } else if (error.status === 403) {
        friendlyMessage = 'Forbidden: Your application token is incorrect.';
      } else if (error.status === 404) {
        friendlyMessage = 'The requested database item could not be found.';
      } else if (error.status === 500) {
        friendlyMessage = 'Internal Server Error: The backend database crashed.';
      }

      console.error(`[Global Error Interceptor Handled]: ${friendlyMessage}`, error);
      return throwError(() => new Error(friendlyMessage));
    }),
  );
};
