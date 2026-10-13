import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useApp } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { User, Wrench, Shield, LogIn, UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, registerStaff, currentUser } = useApp()
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<'resident' | 'staff' | 'admin'>('resident')
  const [isStaffRegistering, setIsStaffRegistering] = useState(false)

  // Resident state
  const [residentIdentifier, setResidentIdentifier] = useState('citizen_ali@metropolis.gov')

  // Staff Sign In state
  const [staffUsername, setStaffUsername] = useState('staff_imran')
  const [staffPassword, setStaffPassword] = useState('••••••••')

  // Staff Register state
  const [regStaffName, setRegStaffName] = useState('')
  const [regStaffUsername, setRegStaffUsername] = useState('')
  const [regDepartment, setRegDepartment] = useState('Road Maintenance Dept')
  const [regStaffPassword, setRegStaffPassword] = useState('')

  // Admin state
  const [adminUsername, setAdminUsername] = useState('admin_fatima')
  const [adminPassword, setAdminPassword] = useState('••••••••')

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)

  const returnUrl = (location.state as any)?.from?.pathname || (
    activeTab === 'admin' ? '/admin' : activeTab === 'staff' ? '/staff' : '/'
  )

  const handleResidentLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login({
      username: residentIdentifier || 'citizen_ali',
      full_name: 'Resident Citizen',
      role: 'resident',
    })
    navigate(returnUrl)
  }

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login({
      username: staffUsername,
      full_name: staffUsername === 'staff_imran' ? 'Engr. Imran Staff' : staffUsername,
      department: 'Road Maintenance Dept',
      role: 'staff',
    })
    navigate('/staff')
  }

  const handleStaffRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regStaffName.trim() || !regStaffUsername.trim()) {
      setFeedbackMsg('Please complete all staff registration fields.')
      return
    }
    registerStaff(regStaffUsername, regStaffName, regDepartment)
    navigate('/staff')
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login({
      username: adminUsername,
      full_name: 'Director Fatima Admin',
      department: 'Municipal HQ',
      role: 'admin',
    })
    navigate('/admin')
  }

  return (
    <PageContainer size="narrow" className="py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <Card className="shadow-card border-border max-w-lg mx-auto overflow-hidden">
        <CardHeader className="text-center pb-3">
          <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold">CivicCare Authentication</CardTitle>
          <CardDescription>
            Choose your portal access role to continue.
          </CardDescription>
        </CardHeader>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-border bg-background text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('resident')
              setFeedbackMsg(null)
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'resident'
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Resident</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('staff')
              setFeedbackMsg(null)
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'staff'
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Field Staff</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin')
              setFeedbackMsg(null)
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin HQ</span>
          </button>
        </div>

        <CardContent className="p-6">
          {feedbackMsg && (
            <div className="mb-4 p-3 rounded-control bg-status-onhold-soft text-status-onhold text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* RESIDENT FORM */}
          {activeTab === 'resident' && (
            <form onSubmit={handleResidentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Email or Mobile Phone Number
                </label>
                <Input
                  value={residentIdentifier}
                  onChange={(e) => setResidentIdentifier(e.target.value)}
                  placeholder="e.g. resident@metropolis.gov or 0300-1234567"
                  required
                />
                <p className="text-[11px] text-text-muted mt-1">
                  Sign in to view your submitted complaints and receive resolution SMS updates.
                </p>
              </div>

              <Button type="submit" variant="primary" className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                <span>Continue as Resident</span>
              </Button>
            </form>
          )}

          {/* STAFF FORM */}
          {activeTab === 'staff' && (
            <div>
              <div className="flex items-center justify-center gap-4 mb-5 text-xs">
                <button
                  type="button"
                  onClick={() => setIsStaffRegistering(false)}
                  className={`font-semibold pb-1 border-b-2 ${
                    !isStaffRegistering ? 'border-primary text-primary' : 'border-transparent text-text-muted'
                  }`}
                >
                  Staff Sign In
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={() => setIsStaffRegistering(true)}
                  className={`font-semibold pb-1 border-b-2 ${
                    isStaffRegistering ? 'border-primary text-primary' : 'border-transparent text-text-muted'
                  }`}
                >
                  Create Staff Account
                </button>
              </div>

              {!isStaffRegistering ? (
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Staff ID or Username
                    </label>
                    <Input
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      placeholder="e.g. staff_imran"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full gap-2">
                    <Wrench className="w-4 h-4" />
                    <span>Sign In to Field Portal</span>
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleStaffRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Full Name *
                    </label>
                    <Input
                      value={regStaffName}
                      onChange={(e) => setRegStaffName(e.target.value)}
                      placeholder="e.g. Engr. Asim Khan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Desired Staff Username *
                    </label>
                    <Input
                      value={regStaffUsername}
                      onChange={(e) => setRegStaffUsername(e.target.value)}
                      placeholder="e.g. staff_asim"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Assigned Municipal Department *
                    </label>
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full h-10 rounded-control border border-border bg-card px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="Road Maintenance Dept">Road Maintenance Dept</option>
                      <option value="Water & Sanitation Authority">Water & Sanitation Authority</option>
                      <option value="Municipal Electrical Services">Municipal Electrical Services</option>
                      <option value="Solid Waste Management">Solid Waste Management</option>
                      <option value="Power Distribution Corp">Power Distribution Corp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Set Password *
                    </label>
                    <Input
                      type="password"
                      value={regStaffPassword}
                      onChange={(e) => setRegStaffPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full gap-2 mt-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Activate Staff Account</span>
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* ADMIN FORM */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-control bg-primary-soft/60 border border-primary/20 text-xs text-text-muted space-y-1">
                <span className="font-semibold text-primary block">
                  Municipal Headquarters Clearance
                </span>
                <p>
                  Admin HQ accounts manage city-wide SLA rules, triage thresholds, and low-confidence review queues. New administrator credentials are provisioned exclusively by Central City Administration.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Admin Official Username
                </label>
                <Input
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="e.g. admin_fatima"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Master Password
                </label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full gap-2">
                <Shield className="w-4 h-4" />
                <span>Enter Admin Command HQ</span>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
