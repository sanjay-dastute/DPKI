'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Layout from '@/components/layout/Layout';

export default function LoginPage() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <LoginForm />
      </div>
    </Layout>
  );
}
