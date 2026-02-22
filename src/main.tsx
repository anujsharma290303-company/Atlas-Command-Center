import { RouterProvider } from "react-router-dom";
import React from "react";
import ReactDom from "react-dom/client";
import { router } from "./app/router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css"
import { Toaster } from "react-hot-toast";
ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          className: '',
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          },
          
          // Success toast styling
          success: {
            duration: 3000,
            style: {
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          
          // Error toast styling
          error: {
            duration: 5000,
            style: {
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          
          // Loading toast styling
          loading: {
            duration: Infinity,
            style: {
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
            },
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
