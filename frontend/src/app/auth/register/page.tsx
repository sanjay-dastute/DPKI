'use client';

import React from 'react';
import RegisterForm from '../../../components/auth/RegisterForm';
import Layout from '../../../components/layout/Layout';

export default function RegisterPage() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <RegisterForm />
      </div>
    </Layout>
  );
}
