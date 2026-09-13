import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'

export default function Discoverpage() {
  return (
    <UserLayout>
        <DashboardLayout>
            <div>
                <h1>Discover</h1>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}
