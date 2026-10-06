'use client'

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Cpu,
  Database,
  Eye,
  FileText,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Network,
  Play,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Square,
  User,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react'

type Severity = 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type Event = {
  time: string
  subject: string
  action: string
  severity: Severity
  location: string
}

const events: Event[] = [
  {
    time: '10:23:14',
    subject: 'Laptop #42',
    action: 'Unattended threshold exceeded',
    severity: 'HIGH',
    location: 'Workspace A'
  },
  {
    time: '10:21:42',
    subject: 'Person #17',
    action: 'Left Workspace A',
    severity: 'INFO',
    location: 'Workspace A'
  },
  {
    time: '10:18:06',
    subject: 'Equipment #08',
    action: 'Activity detected',
    severity: 'INFO',
    location: 'Laboratory'
  },
  {
    time: '10:15:31',
    subject: 'Person #21',
    action: 'Entered Restricted Zone',
    severity: 'MEDIUM',
    location: 'Workspace B'
  }
]

const demoEvents: Event[] = [
  {
    time: '10:23',
    subject: 'Laptop #42',
    action: 'Alert generated',
    severity: 'HIGH',
    location: 'Workspace A'
  },
  {
    time: '10:23',
    subject: 'Laptop #42',
    action: 'Unattended threshold exceeded',
    severity: 'HIGH',
    location: 'Workspace A'
  },
  {
    time: '10:10',
    subject: 'Laptop #42',
    action: 'Remained in Workspace A',
    severity: 'MEDIUM',
    location: 'Workspace A'
  },
  {
    time: '10:08',
    subject: 'Person #17',
    action: 'Left Workspace A',
    severity: 'INFO',
    location: 'Workspace A'
  },
  {
    time: '10:04',
    subject: 'Person #17',
    action: 'Began interacting with Laptop #42',
    severity: 'INFO',
    location: 'Workspace A'
  },
  {
    time: '10:02',
    subject: 'Person #17',
    action: 'Entered Workspace A',
    severity: 'INFO',
    location: 'Workspace A'
  }
]

const chartData = [
  { name: 'Mon', events: 42, alerts: 4 },
  { name: 'Tue', events: 58, alerts: 6 },
  { name: 'Wed', events: 48, alerts: 3 },
  { name: 'Thu', events: 76, alerts: 8 },
  { name: 'Fri', events: 128, alerts: 5 },
  { name: 'Sat', events: 68, alerts: 2 },
  { name: 'Sun', events: 84, alerts: 4 }
]

const nav = [
  {
    href: '/',
    label: 'Command Center',
    icon: LayoutDashboard
  },
  {
    href: '/live',
    label: 'Live Environment',
    icon: Video
  },
  {
    href: '/events',
    label: 'Event Memory',
    icon: Clock3
  },
  {
    href: '/alerts',
    label: 'Alerts',
    icon: Bell
  },
  {
    href: '/investigations',
    label: 'Investigations',
    icon: Search
  },
  {
    href: '/assistant',
    label: 'AI Assistant',
    icon: Bot
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3
  },
  {
    href: '/configuration',
    label: 'Configuration',
    icon: Settings2
  }
]

function Badge({
  children,
  severity
}: {
  children: React.ReactNode
  severity?: Severity
}) {
  return (
    <span className={`badge ${severity?.toLowerCase() || 'green'}`}>
      {children}
    </span>
  )
}

function Toast({ message }: { message: string }) {
  if (!message) return null

  return (
    <div className="toast">
      <Check size={15} />
      {message}
    </div>
  )
}

function Sparkline() {
  return (
    <div className="sparkline">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark">
        <span />
        <span />
        <span />
      </div>

      <div>
        <b>SENSE</b>
        <small>ENVIRONMENT INTELLIGENCE</small>
      </div>
    </div>
  )
}

/* =========================================================
   AUTHENTICATION
   ========================================================= */

function Auth({
  mode
}: {
  mode: 'login' | 'signup' | 'forgot'
}) {
  const router = useRouter()

  const [email, setEmail] = useState(
    mode === 'login' ? 'operator@sense.ai' : ''
  )

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(true)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (mode !== 'forgot') return

    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setRecovery(true)
      }
    }

    checkRecoverySession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecovery(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mode])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      /* PASSWORD RESET EMAIL */

      if (mode === 'forgot' && !recovery) {
        const { error } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/forgot-password`
          })

        if (error) {
          throw error
        }

        setMessage(
          'If an account exists for this email, password reset instructions have been sent.'
        )

        return
      }

      /* SET NEW PASSWORD */

      if (mode === 'forgot' && recovery) {
        if (password.length < 8) {
          throw new Error(
            'Password must be at least 8 characters.'
          )
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const { error } = await supabase.auth.updateUser({
          password
        })

        if (error) {
          throw error
        }

        await supabase.auth.signOut()

        setMessage(
          'Password updated successfully. You can now sign in.'
        )

        setTimeout(() => {
          router.push('/login')
        }, 1500)

        return
      }

      /* SIGN UP */

      if (mode === 'signup') {
        if (password.length < 8) {
          throw new Error(
            'Password must be at least 8 characters.'
          )
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const { data, error } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name
              }
            }
          })

        if (error) {
          throw error
        }

        if (data.session) {
          router.push('/')
        } else {
          setMessage(
            'Account created. Please check your email to verify your account before signing in.'
          )
        }

        return
      }

      /* LOGIN */

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        })

      if (error) {
        throw error
      }

      router.push('/')

    } catch (err: any) {
      setError(
        err?.message ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const oauth = async (
    provider: 'google' | 'github'
  ) => {
    setLoading(true)
    setError('')

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/`
          }
        })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(
        err?.message ||
        `Unable to continue with ${provider}.`
      )

      setLoading(false)
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-visual">

        <div className="auth-top">
          <Logo />

          <span className="system-pill">
            <i /> All systems operational
          </span>
        </div>

        <div className="auth-copy">

          <p className="eyebrow">
            ENVIRONMENT INTELLIGENCE SYSTEM
          </p>

          <h1>
            AI that understands
            <br />
            <em>what happens</em>
            <br />
            around it.
          </h1>

          <p>
            See the world in context. SENSE transforms live
            environments into memory, reasoning, and action.
          </p>

          <div className="flow">
            <span>SEE</span>
            <i>→</i>
            <span>UNDERSTAND</span>
            <i>→</i>
            <span>REMEMBER</span>
            <i>→</i>
            <span>REASON</span>
          </div>

        </div>

        <div className="auth-orbit">

          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />

          <div className="orbit-core">
            <Eye size={25} />
            <small>OBSERVING</small>
          </div>

          <div className="orbit-node n1">
            CAM 01
          </div>

          <div className="orbit-node n2">
            EVENT
          </div>

          <div className="orbit-node n3">
            AI
          </div>

        </div>

        <div className="auth-footer">
          SENSE / SECURE ENVIRONMENT INTELLIGENCE
          <span>v2.4.0</span>
        </div>

      </div>

      <div className="auth-panel">

        <div className="auth-form-wrap">

          <div className="mobile-logo">
            <Logo />
          </div>

          {/* =========================
              FORGOT PASSWORD
             ========================= */}

          {mode === 'forgot' ? (

            <>
              <p className="eyebrow">
                {recovery
                  ? 'PASSWORD RESET'
                  : 'ACCOUNT RECOVERY'}
              </p>

              <h2>
                {recovery
                  ? 'Set a new password'
                  : 'Forgot your password?'}
              </h2>

              <p className="auth-sub">
                {recovery
                  ? 'Choose a new password for your SENSE account.'
                  : "Enter your email and we'll send you secure reset instructions."}
              </p>

              {error && (
                <div className="error-box">
                  <X size={17} />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="success-box">
                  <Check size={17} />
                  <span>{message}</span>
                </div>
              )}

              {(!message || recovery) && (
                <form onSubmit={submit}>

                  {!recovery ? (
                    <>
                      <label>
                        Email

                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          required
                        />
                      </label>

                      <button
                        className="primary-btn"
                        disabled={loading}
                      >
                        {loading
                          ? 'Sending...'
                          : 'Send Reset Link'}

                        <span>→</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <label>
                        New password

                        <input
                          type="password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          minLength={8}
                          required
                        />
                      </label>

                      <label>
                        Confirm password

                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          minLength={8}
                          required
                        />
                      </label>

                      <button
                        className="primary-btn"
                        disabled={loading}
                      >
                        {loading
                          ? 'Updating...'
                          : 'Update Password'}

                        <span>→</span>
                      </button>
                    </>
                  )}

                </form>
              )}

              <button
                className="text-btn"
                onClick={() => router.push('/login')}
              >
                ← Back to sign in
              </button>
            </>

          ) : (

            /* =========================
               LOGIN / SIGNUP
               ========================= */

            <>
              <p className="eyebrow">
                {mode === 'signup'
                  ? 'CREATE YOUR WORKSPACE'
                  : 'WELCOME BACK'}
              </p>

              <h2>
                {mode === 'signup'
                  ? 'Create your SENSE account'
                  : 'Sign in to SENSE'}
              </h2>

              <p className="auth-sub">
                {mode === 'signup'
                  ? 'Start seeing your environment in context.'
                  : 'Your environment is ready for investigation.'}
              </p>

              {error && (
                <div className="error-box">
                  <X size={17} />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="success-box">
                  <Check size={17} />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={submit}>

                {mode === 'signup' && (
                  <label>
                    Full name

                    <input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />
                  </label>
                )}

                <label>
                  Email

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Password

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    minLength={8}
                    required
                  />
                </label>

                {mode === 'signup' && (
                  <label>
                    Confirm password

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      minLength={8}
                      required
                    />
                  </label>
                )}

                {mode === 'login' && (
                  <div className="form-row">

                    <label className="check">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) =>
                          setRemember(e.target.checked)
                        }
                      />

                      Remember me
                    </label>

                    <button
                      type="button"
                      className="link-btn"
                      onClick={() =>
                        router.push('/forgot-password')
                      }
                    >
                      Forgot password?
                    </button>

                  </div>
                )}

                <button
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'signup'
                      ? 'Create SENSE Account'
                      : 'Sign In'}

                  <span>→</span>
                </button>

              </form>

              {mode === 'login' && (
                <>
                  <div className="divider">
                    <span>or continue with</span>
                  </div>

                  <div className="oauth-buttons">

                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() =>
                        oauth('google')
                      }
                      disabled={loading}
                    >
                      <span>G</span>
                      Google
                    </button>

                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() =>
                        oauth('github')
                      }
                      disabled={loading}
                    >
                      GitHub
                    </button>

                  </div>

                  <div className="demo-access">

                    <b>Demo account</b>

                    <span>
                      operator@sense.ai
                    </span>

                    <span>
                      SenseDemo@2026
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setEmail('operator@sense.ai')
                        setPassword('SenseDemo@2026')
                      }}
                    >
                      Fill demo credentials →
                    </button>

                  </div>
                </>
              )}

              <p className="switch">

                {mode === 'signup'
                  ? 'Already have an account? '
                  : "Don't have an account? "}

                <button
                  onClick={() =>
                    router.push(
                      mode === 'signup'
                        ? '/login'
                        : '/signup'
                    )
                  }
                >
                  {mode === 'signup'
                    ? 'Sign in'
                    : 'Create account'}
                </button>

              </p>

            </>
          )}

        </div>

      </div>

    </main>
  )
}

/* =========================================================
   APPLICATION SHELL
   ========================================================= */

function AppShell({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const path = usePathname()

  const [mobile, setMobile] = useState(false)
  const [profile, setProfile] = useState(false)
  const [toast, setToast] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()

      setUser(data.user)
    }

    loadUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  const notify = (message: string) => {
    setToast(message)

    setTimeout(() => {
      setToast('')
    }, 2600)
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Operator'

  const displayEmail =
    user?.email ||
    ''

  const initials =
    displayName
      .split(/\s+/)
      .map((word: string) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  const logout = async () => {

    await supabase.auth.signOut()

    notify('Signed out successfully.')

    router.push('/login')
  }

  return (
    <div className="app-shell">

      <aside className={mobile ? 'open' : ''}>

        <div className="side-head">

          <Logo />

          <button
            className="icon-btn mobile-only"
            onClick={() => setMobile(false)}
          >
            <X />
          </button>

        </div>

        <div className="workspace">
          <span className="workspace-dot" />
          SENSE Environment
          <ChevronDown size={14} />
        </div>

        <nav>

          {nav.map((n) => {

            const Icon = n.icon

            return (
              <button
                key={n.href}
                className={
                  path === n.href
                    ? 'active'
                    : ''
                }
                onClick={() => {
                  router.push(n.href)
                  setMobile(false)
                }}
              >

                <Icon size={17} />

                <span>{n.label}</span>

                {n.label === 'Alerts' && (
                  <b className="nav-count">
                    2
                  </b>
                )}

              </button>
            )
          })}

        </nav>

        <div className="side-bottom">

          <div className="status-line">
            <i />
            System operational
            <span>●</span>
          </div>

          <button
            className="profile-mini"
            onClick={() =>
              setProfile(!profile)
            }
          >

            <div className="avatar">
              {initials}
            </div>

            <div>
              <b>{displayName}</b>
              <small>{displayEmail}</small>
            </div>

            <MoreHorizontal size={17} />

          </button>

          {profile && (
            <div className="profile-menu">

              <button
                onClick={() =>
                  router.push('/profile')
                }
              >
                <User size={15} />
                Profile
              </button>

              <button>
                <Settings2 size={15} />
                Preferences
              </button>

              <button onClick={logout}>
                <LogOut size={15} />
                Logout
              </button>

            </div>
          )}

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <button
            className="icon-btn mobile-menu"
            onClick={() =>
              setMobile(true)
            }
          >
            <Menu />
          </button>

          <div className="breadcrumbs">

            <span>SENSE</span>
            <b>/</b>

            <strong>
              {nav.find(
                (n) => n.href === path
              )?.label || 'Command Center'}
            </strong>

          </div>

          <div className="top-actions">

            <button className="icon-btn">
              <CircleHelp size={18} />
            </button>

            <button className="icon-btn notification">
              <Bell size={18} />
              <i />
            </button>

            <div className="top-avatar">
              {initials}
            </div>

          </div>

        </header>

        {children}

      </main>

      <Toast message={toast} />

    </div>
  )
}

/* =========================================================
   SHARED UI
   ========================================================= */

function PageHeader({
  eyebrow,
  title,
  sub,
  action
}: {
  eyebrow: string
  title: string
  sub: string
  action?: React.ReactNode
}) {
  return (
    <div className="page-header">

      <div>
        <p className="eyebrow">
          {eyebrow}
        </p>

        <h1>{title}</h1>

        <p>{sub}</p>
      </div>

      {action}

    </div>
  )
}

function StatCard({
  label,
  value,
  meta,
  icon: Icon,
  accent
}: {
  label: string
  value: string
  meta: string
  icon: any
  accent?: boolean
}) {
  return (
    <div
      className={`stat-card ${
        accent ? 'accent' : ''
      }`}
    >

      <div className="stat-icon">
        <Icon size={17} />
      </div>

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{meta}</small>

      {accent && <Sparkline />}

    </div>
  )
}

/* =========================================================
   COMMAND CENTER
   ========================================================= */

function CommandCenter({
  startDemo,
  onDemo
}: {
  startDemo: boolean
  onDemo: (v: boolean) => void
}) {
  const [tab, setTab] =
    useState('Overview')

  return (
    <>
      <PageHeader
        eyebrow="COMMAND CENTER / LIVE OVERVIEW"
        title="Command Center"
        sub="Real-time intelligence across your monitored environment."
        action={
          <button
            className={
              startDemo
                ? 'danger-btn'
                : 'primary-btn'
            }
            onClick={() =>
              onDemo(!startDemo)
            }
          >
            {startDemo ? (
              <>
                <Square size={15} />
                Stop Demo
              </>
            ) : (
              <>
                <Play size={15} />
                Start Demo
              </>
            )}
          </button>
        }
      />

      {startDemo && (
        <div className="demo-banner">

          <span>
            <i /> DEMO MODE ACTIVE
          </span>

          <p>
            Simulating Workspace A incident
            sequence · event memory updating
            in real time
          </p>

          <b>10:23 / 10:23</b>

        </div>
      )}

      <div className="stats-grid">

        <StatCard
          label="Active Cameras"
          value="3 / 3"
          meta="All systems online"
          icon={Camera}
        />

        <StatCard
          label="People Detected"
          value={startDemo ? '8' : '7'}
          meta="Across 3 zones"
          icon={Users}
        />

        <StatCard
          label="Objects Tracked"
          value={startDemo ? '15' : '14'}
          meta="6 equipment classes"
          icon={HardDrive}
        />

        <StatCard
          label="Active Alerts"
          value={startDemo ? '3' : '2'}
          meta="1 high priority"
          icon={AlertTriangle}
          accent
        />

        <StatCard
          label="Events Today"
          value={startDemo ? '134' : '128'}
          meta="+18% vs yesterday"
          icon={Activity}
        />

        <StatCard
          label="AI Analyses"
          value="34"
          meta="94% avg confidence"
          icon={Bot}
        />

      </div>

      <div className="content-grid">

        <section className="panel wide">

          <div className="panel-head">

            <div>
              <p className="eyebrow">
                EVENT MEMORY
              </p>

              <h3>
                Signal activity
              </h3>
            </div>

            <div className="tabs">

              {[
                'Overview',
                'Events',
                'Alerts'
              ].map((t) => (
                <button
                  key={t}
                  className={
                    tab === t
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    setTab(t)
                  }
                >
                  {t}
                </button>
              ))}

            </div>

          </div>

          <div className="chart-wrap">

            <ResponsiveContainer
              width="100%"
              height={230}
            >
              <AreaChart
                data={chartData}
              >

                <defs>

                  <linearGradient
                    id="fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#16a34a"
                      stopOpacity={0.28}
                    />

                    <stop
                      offset="100%"
                      stopColor="#16a34a"
                      stopOpacity={0}
                    />
                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#1a2a20"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#718078"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#718078"
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: '#122019',
                    border: '1px solid #1a2a20',
                    borderRadius: 8
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#22c55e"
                  fill="url(#fill)"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="#d9a441"
                  strokeWidth={2}
                  dot={false}
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>

        </section>

        <section className="panel">

          <div className="panel-head">

            <div>
              <p className="eyebrow">
                SYSTEM STATUS
              </p>

              <h3>
                Operating normally
              </h3>
            </div>

            <span className="live-dot">
              LIVE
            </span>

          </div>

          <div className="system-list">

            {[
              ['Vision Engine', Cpu],
              ['Event Engine', Zap],
              ['Database', Database],
              ['WebSocket', Network],
              ['Nemotron', Sparkles]
            ].map(([name, Icon]: any) => (
              <div key={name}>

                <Icon size={15} />

                <span>{name}</span>

                <b>
                  <i /> ONLINE
                </b>

              </div>
            ))}

          </div>

          <div className="status-foot">
            <span>Last heartbeat</span>
            <b>12 seconds ago</b>
          </div>

        </section>

      </div>

      <div className="content-grid lower">

        <section className="panel">

          <div className="panel-head">

            <div>
              <p className="eyebrow">
                LIVE EVENT STREAM
              </p>

              <h3>
                What's happening now
              </h3>
            </div>

            <button className="link-btn">
              View all →
            </button>

          </div>

          <EventList
            items={
              startDemo
                ? demoEvents.slice(0, 4)
                : events
            }
          />

        </section>

        <section className="panel">

          <div className="panel-head">

            <div>
              <p className="eyebrow">
                ACTIVE INVESTIGATION
              </p>

              <h3>
                Unattended equipment
              </h3>
            </div>

            <Badge severity="HIGH">
              HIGH
            </Badge>

          </div>

          <div className="incident-card">

            <div className="incident-icon">
              <AlertTriangle size={20} />
            </div>

            <div>

              <b>Laptop #42</b>

              <p>
                Unattended for 15 minutes
              </p>

              <span>
                Workspace A · Detected 10:10
              </span>

            </div>

          </div>

          <div className="reasoning-mini">

            <Sparkles size={15} />

            <span>
              SENSE connected the interaction,
              departure, and threshold in one
              explainable incident.
            </span>

          </div>

          <button
            className="secondary-btn full"
            onClick={() =>
              location.assign(
                '/investigations/EVT-1024'
              )
            }
          >
            Open investigation
            <span>→</span>
          </button>

        </section>

      </div>
    </>
  )
}

/* =========================================================
   EVENT LIST
   ========================================================= */

function EventList({
  items
}: {
  items: Event[]
}) {
  return (
    <div className="event-list">

      {items.map((e, i) => (
        <div
          className="event-row"
          key={i}
        >

          <div className="event-time">
            {e.time}
          </div>

          <div className="event-signal">
            <i />
          </div>

          <div className="event-copy">

            <b>{e.subject}</b>

            <span>
              {e.action} · {e.location}
            </span>

          </div>

          <Badge severity={e.severity}>
            {e.severity}
          </Badge>

        </div>
      ))}

    </div>
  )
}

/* =========================================================
   LIVE
   ========================================================= */

function Live() {
  const [demo, setDemo] =
    useState(false)

  return (
    <>
      <PageHeader
        eyebrow="LIVE / CAMERA NETWORK"
        title="Live Environment"
        sub="Observe your environment with context, not just video."
        action={
          <button
            className={
              demo
                ? 'danger-btn'
                : 'primary-btn'
            }
            onClick={() =>
              setDemo(!demo)
            }
          >
            {demo ? (
              <>
                <Square size={15} />
                Stop Demo
              </>
            ) : (
              <>
                <Play size={15} />
                Demo Mode
              </>
            )}
          </button>
        }
      />

      <div className="camera-layout">

        <section className="camera-view">

          <div className="camera-top">

            <span>
              <i /> LIVE
            </span>

            <b>
              CAMERA 01 / WORKSPACE A
            </b>

            <small>
              24 FPS · 6 OBJECTS
            </small>

          </div>

          <div className="camera-scene">

            <div className="grid-lines" />

            <div className="desk" />

            <div className="person person-one">
              <div className="head" />
              <div className="body" />
            </div>

            <div className="laptop">

              <div />

              <span>
                Laptop #42
              </span>

            </div>

            <div className="detect d-person">
              Person #17 <i />
            </div>

            <div className="detect d-laptop">
              Laptop #42 <i />
            </div>

            <div className="detect d-equip">
              Equipment #08 <i />
            </div>

            <div className="scene-label">
              {demo
                ? 'SIMULATION / WORKSPACE A'
                : 'CAMERA FEED / WORKSPACE A'}
            </div>

          </div>

          <div className="camera-footer">

            <span>
              <Eye size={14} />
              Anonymous tracking enabled
            </span>

            <span>
              Signal 98%
            </span>

          </div>

        </section>

        <section className="panel camera-events">

          <div className="panel-head">

            <div>
              <p className="eyebrow">
                CONTEXTUAL FEED
              </p>

              <h3>
                Live event stream
              </h3>
            </div>

            <span className="live-dot">
              LIVE
            </span>

          </div>

          <EventList
            items={
              demo
                ? demoEvents
                : events
            }
          />

        </section>

      </div>
    </>
  )
}

/* =========================================================
   EVENTS
   ========================================================= */

function Events() {
  const [filter, setFilter] =
    useState('All')

  const filtered =
    filter === 'All'
      ? demoEvents
      : demoEvents.filter((e) =>
          filter === 'Alerts'
            ? e.severity === 'HIGH'
            : filter === 'People'
              ? e.subject.startsWith('Person')
              : filter === 'Equipment'
                ? e.subject.startsWith('Laptop') ||
                  e.subject.startsWith('Equipment')
                : true
        )

  return (
    <>
      <PageHeader
        eyebrow="MEMORY / CONTEXTUAL EVENTS"
        title="Event Memory"
        sub="SENSE remembers meaningful changes across time."
        action={
          <button className="secondary-btn">
            <FileText size={15} />
            Export memory
          </button>
        }
      />

      <div className="filter-bar">

        <div className="filter-tabs">

          {[
            'All',
            'People',
            'Equipment',
            'Zones',
            'Alerts',
            'Incidents'
          ].map((f) => (
            <button
              className={
                filter === f
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                setFilter(f)
              }
              key={f}
            >
              {f}
            </button>
          ))}

        </div>

        <div className="filter-selects">

          <button>
            Location
            <ChevronDown size={14} />
          </button>

          <button>
            Time range
            <ChevronDown size={14} />
          </button>

          <button>
            Severity
            <ChevronDown size={14} />
          </button>

        </div>

      </div>

      <section className="panel memory-panel">

        <div className="memory-head">

          <span>
            Today, October 5, 2026
          </span>

          <b>
            {filtered.length} meaningful events
          </b>

        </div>

        <div className="memory-timeline">

          {filtered.map((e, i) => (
            <div
              className="memory-item"
              key={i}
            >

              <div className="memory-time">
                {e.time}
                <small>AM</small>
              </div>

              <div className="memory-line">
                <i />
              </div>

              <div className="memory-content">

                <div>

                  <b>{e.subject}</b>

                  <Badge severity={e.severity}>
                    {e.severity}
                  </Badge>

                </div>

                <p>{e.action}</p>

                <span>
                  <Clock3 size={13} />
                  {e.location}
                </span>

              </div>

            </div>
          ))}

        </div>

      </section>
    </>
  )
}

/* =========================================================
   ALERTS
   ========================================================= */

function Alerts() {
  const [active, setActive] =
    useState(true)

  return (
    <>
      <PageHeader
        eyebrow="RESPONSE / ALERTS"
        title="Alerts"
        sub="Explainable signals that help your team act with confidence."
      />

      <div className="alert-tabs">

        {[
          'All',
          'Active',
          'Acknowledged',
          'Resolved'
        ].map((x, i) => (
          <button
            key={x}
            className={
              i === 0 ||
              (i === 1 && active)
                ? 'selected'
                : ''
            }
          >
            {x}

            <span>
              {i < 2
                ? active
                  ? '2'
                  : '1'
                : '0'}
            </span>

          </button>
        ))}

      </div>

      {active ? (
        <section className="alert-card high">

          <div className="alert-severity">

            <AlertTriangle size={20} />

            <span>
              HIGH PRIORITY
            </span>

          </div>

          <div className="alert-main">

            <div>

              <p className="eyebrow">
                EVT-1024 · 10:23 AM
              </p>

              <h2>
                Unattended Equipment
              </h2>

              <p>
                Laptop #42 remained unattended
                in Workspace A for 15 minutes
                after the associated person left
                the zone.
              </p>

              <div className="alert-meta">

                <span>
                  <MapPinIcon />
                  Workspace A
                </span>

                <span>
                  <Clock3 />
                  15 minutes
                </span>

                <span>
                  <Bot />
                  94% confidence
                </span>

              </div>

            </div>

            <Badge severity="HIGH">
              HIGH
            </Badge>

          </div>

          <div className="alert-actions">

            <button
              className="primary-btn"
              onClick={() =>
                location.assign(
                  '/investigations/EVT-1024'
                )
              }
            >
              Investigate
              <span>→</span>
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                setActive(false)
              }
            >
              <Check size={15} />
              Acknowledge
            </button>

          </div>

        </section>
      ) : (
        <div className="empty-state">

          <Check size={24} />

          <h3>
            No active alerts
          </h3>

          <p>
            All environment signals have
            been acknowledged.
          </p>

        </div>
      )}
    </>
  )
}

function MapPinIcon() {
  return <Activity size={14} />
}

/* =========================================================
   INVESTIGATIONS
   ========================================================= */

function Investigations({
  detail = false
}: {
  detail?: boolean
}) {
  if (detail) {
    return <Incident />
  }

  return (
    <>
      <PageHeader
        eyebrow="REASON / INCIDENTS"
        title="Investigations"
        sub="Trace the sequence behind every meaningful alert."
        action={
          <button className="secondary-btn">
            <FileText size={15} />
            Export report
          </button>
        }
      />

      <div className="incident-grid">

        {[
          [
            'EVT-1024',
            'Unattended Laptop',
            'HIGH',
            'Workspace A',
            '10:23 AM'
          ],
          [
            'EVT-1021',
            'Restricted Area Entry',
            'MEDIUM',
            'Workspace B',
            '10:15 AM'
          ],
          [
            'EVT-1018',
            'After-hours Activity',
            'INFO',
            'Laboratory',
            '09:42 AM'
          ]
        ].map((x, i) => (

          <button
            className="incident-list-card"
            key={i}
            onClick={() =>
              i === 0 &&
              location.assign(
                '/investigations/EVT-1024'
              )
            }
          >

            <div className="incident-card-top">

              <span>{x[0]}</span>

              <Badge
                severity={
                  x[2] as Severity
                }
              >
                {x[2]}
              </Badge>

            </div>

            <h3>{x[1]}</h3>

            <p>{x[3]}</p>

            <small>
              {x[4]}
              <span>→</span>
            </small>

          </button>

        ))}

      </div>
    </>
  )
}

/* =========================================================
   INCIDENT
   ========================================================= */

function Incident() {
  return (
    <>
      <PageHeader
        eyebrow="INVESTIGATION / EVT-1024"
        title="Unattended Laptop"
        sub="A complete explanation of what happened in Workspace A."
        action={
          <div className="header-badges">
            <Badge severity="HIGH">
              HIGH
            </Badge>

            <Badge>
              ACTIVE
            </Badge>
          </div>
        }
      />

      <div className="incident-detail-grid">

        <section className="panel">

          <div className="panel-head">

            <div>

              <p className="eyebrow">
                EVENT SEQUENCE
              </p>

              <h3>
                What happened
              </h3>

            </div>

            <span className="confidence">
              <Sparkles size={14} />
              94% AI confidence
            </span>

          </div>

          <div className="detail-timeline">

            {[
              [
                '10:02',
                'Person #17',
                'Entered Workspace A'
              ],
              [
                '10:04',
                'Person #17',
                'Began interacting with Laptop #42'
              ],
              [
                '10:08',
                'Person #17',
                'Left Workspace A'
              ],
              [
                '10:10',
                'Laptop #42',
                'Remained in Workspace A'
              ],
              [
                '10:23',
                'SENSE',
                'Unattended threshold exceeded'
              ],
              [
                '10:23',
                'SENSE',
                'Alert generated'
              ]
            ].map((x, i) => (

              <div
                key={i}
                className={
                  i > 3
                    ? 'emphasis'
                    : ''
                }
              >

                <span>{x[0]}</span>

                <i />

                <div>
                  <b>{x[1]}</b>
                  <p>{x[2]}</p>
                </div>

              </div>

            ))}

          </div>

        </section>

        <section className="panel reasoning">

          <div className="reasoning-label">
            <Sparkles size={15} />
            SENSE AI REASONING
          </div>

          <h2>
            Why was this alert generated?
          </h2>

          <p className="answer">
            Person #17 was previously interacting
            with Laptop #42. Person #17 subsequently
            left Workspace A while the laptop remained
            present. The configured 15-minute unattended
            threshold was exceeded, resulting in the alert.
          </p>

          <div className="reason-checks">

            {[
              'Previous interaction detected',
              'Associated person left',
              'Equipment remained',
              'Threshold exceeded',
              'Alert generated'
            ].map((x) => (
              <span key={x}>
                <Check size={14} />
                {x}
              </span>
            ))}

          </div>

          <button
            className="primary-btn full"
            onClick={() =>
              location.assign('/assistant')
            }
          >
            Ask SENSE about this incident
            <span>→</span>
          </button>

        </section>

      </div>
    </>
  )
}

/* =========================================================
   AI ASSISTANT
   ========================================================= */

function Assistant() {
  const [input, setInput] =
    useState('')

  const [messages, setMessages] =
    useState<
      {
        from: string
        text: string
      }[]
    >([
      {
        from: 'ai',
        text:
          'I am SENSE. I can connect events across time and explain what is happening in your environment. What would you like to investigate?'
      }
    ])

  const ask = (q = input) => {

    if (!q.trim()) return

    setMessages((m) => [
      ...m,
      {
        from: 'user',
        text: q
      },
      {
        from: 'ai',
        text: q
          .toLowerCase()
          .includes('before')
          ? 'Before the incident, Person #17 entered Workspace A at 10:02 and began interacting with Laptop #42 at 10:04. They left at 10:08, leaving the equipment behind. SENSE connected these events to the unattended alert at 10:23.'
          : 'In Workspace A, SENSE observed 8 meaningful events today. The latest sequence involves Person #17, Laptop #42, and a high-priority unattended equipment alert.'
      }
    ])

    setInput('')
  }

  return (
    <>
      <PageHeader
        eyebrow="EXPLAIN / AI ASSISTANT"
        title="SENSE AI"
        sub="Ask questions about what happened, what is happening, and why."
      />

      <div className="assistant-layout">

        <section className="panel chat-panel">

          <div className="chat-head">

            <div className="ai-avatar">
              <Sparkles size={17} />
            </div>

            <div>

              <b>
                SENSE Intelligence
              </b>

              <span>
                <i /> Ready to reason
              </span>

            </div>

            <button className="icon-btn">
              <MoreHorizontal size={17} />
            </button>

          </div>

          <div className="messages">

            {messages.map((m, i) => (

              <div
                className={`message ${m.from}`}
                key={i}
              >

                <div className="message-avatar">
                  {m.from === 'ai'
                    ? <Sparkles size={14} />
                    : 'OP'}
                </div>

                <div>

                  <span>
                    {m.from === 'ai'
                      ? 'SENSE AI'
                      : 'You'}
                  </span>

                  <p>
                    {m.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

          <div className="composer">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.nativeEvent.isComposing
                ) {
                  ask()
                }
              }}
              placeholder="Ask SENSE what happened..."
            />

            <button
              onClick={() => ask()}
            >
              <Zap size={16} />
            </button>

            <small>
              AI responses are generated from
              contextual event memory
            </small>

          </div>

        </section>

        <aside className="panel suggestions">

          <p className="eyebrow">
            SUGGESTED QUESTIONS
          </p>

          <h3>
            Explore your environment
          </h3>

          {[
            'What happened in Workspace A?',
            'Why was this alert generated?',
            'What happened before this incident?',
            "Show today's unusual events.",
            'Which equipment is unattended?',
            'Summarize the last hour.'
          ].map((q) => (

            <button
              key={q}
              onClick={() => ask(q)}
            >
              {q}
              <span>→</span>
            </button>

          ))}

          <div className="assistant-note">

            <ShieldCheck size={16} />

            <p>
              SENSE uses anonymous identifiers
              and event context. It never performs
              facial recognition.
            </p>

          </div>

        </aside>

      </div>
    </>
  )
}

/* =========================================================
   ANALYTICS
   ========================================================= */

function Analytics() {
  return (
    <>
      <PageHeader
        eyebrow="UNDERSTAND / ANALYTICS"
        title="Analytics"
        sub="Patterns and signals across your environment."
        action={
          <button className="secondary-btn">
            Last 7 days
            <ChevronDown size={14} />
          </button>
        }
      />

      <div className="analytics-grid">

        <section className="panel analytics-wide">

          <div className="panel-head">

            <div>

              <p className="eyebrow">
                EVENTS OVER TIME
              </p>

              <h3>
                Signal volume
              </h3>

            </div>

            <div className="legend">

              <span>
                <i className="green-dot" />
                Events
              </span>

              <span>
                <i className="yellow-dot" />
                Alerts
              </span>

            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={270}
          >
            <BarChart data={chartData}>

              <CartesianGrid
                stroke="#1a2a20"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#718078"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#718078"
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: '#122019',
                  border: '1px solid #1a2a20'
                }}
              />

              <Bar
                dataKey="events"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="alerts"
                fill="#d9a441"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </section>

        <section className="panel">

          <p className="eyebrow">
            ALERTS BY SEVERITY
          </p>

          <h3>
            Signal health
          </h3>

          <div className="severity-bars">

            {[
              ['HIGH', 32, '#f97316'],
              ['MEDIUM', 48, '#d9a441'],
              ['INFO', 78, '#22c55e']
            ].map((x) => (
              <div key={x[0]}>

                <span>{x[0]}</span>

                <div>
                  <i
                    style={{
                      width: `${x[1]}%`,
                      background: x[2]
                    }}
                  />
                </div>

                <b>{x[1]}</b>

              </div>
            ))}

          </div>

        </section>

        <section className="panel">

          <p className="eyebrow">
            ACTIVITY BY LOCATION
          </p>

          <h3>
            Where signals happen
          </h3>

          <div className="location-bars">

            {[
              ['Workspace A', 68],
              ['Workspace B', 42],
              ['Laboratory', 31],
              ['Warehouse', 18]
            ].map((x) => (
              <div key={x[0]}>

                <span>{x[0]}</span>

                <b>{x[1]}</b>

                <div>
                  <i
                    style={{
                      width: `${x[1]}%`
                    }}
                  />
                </div>

              </div>
            ))}

          </div>

        </section>

      </div>
    </>
  )
}

/* =========================================================
   CONFIGURATION
   ========================================================= */

function Configuration() {
  const [saved, setSaved] =
    useState(false)

  const [threshold, setThreshold] =
    useState('15')

  const toggle = () =>
    setSaved(true)

  return (
    <>
      <PageHeader
        eyebrow="ACT / CONFIGURATION"
        title="Configuration"
        sub="Tune how SENSE observes, remembers, and responds."
        action={
          <button
            className="primary-btn"
            onClick={() => {
              setSaved(true)

              setTimeout(() => {
                setSaved(false)
              }, 2500)
            }}
          >
            <Check size={15} />
            Save changes
          </button>
        }
      />

      {saved && (
        <div className="inline-toast">
          <Check size={15} />
          Configuration saved.
        </div>
      )}

      <div className="config-grid">

        <section className="panel config-section">

          <div>

            <p className="eyebrow">
              MONITORING RULES
            </p>

            <h3>
              Detection thresholds
            </h3>

            <p className="section-sub">
              Rules define when observations become
              meaningful events.
            </p>

          </div>

          <label className="setting-row">

            <span>
              <b>
                Unattended threshold
              </b>

              <small>
                Alert when equipment remains without
                an associated person.
              </small>
            </span>

            <div className="input-suffix">

              <input
                value={threshold}
                onChange={(e) =>
                  setThreshold(e.target.value)
                }
              />

              <span>
                minutes
              </span>

            </div>

          </label>

          <label className="setting-row">

            <span>

              <b>
                Crowd threshold
              </b>

              <small>
                Alert when people detected exceed
                the zone limit.
              </small>

            </span>

            <div className="input-suffix">

              <input defaultValue="8" />

              <span>
                people
              </span>

            </div>

          </label>

          <div className="setting-row">

            <span>

              <b>
                Restricted zone monitoring
              </b>

              <small>
                Observe activity in restricted areas.
              </small>

            </span>

            <button
              className="switch on"
              onClick={toggle}
            >
              <i />
            </button>

          </div>

        </section>

        <section className="panel config-section">

          <p className="eyebrow">
            PRIVACY CONTROLS
          </p>

          <h3>
            Responsible intelligence
          </h3>

          <p className="section-sub">
            SENSE is designed around anonymous,
            event-based context.
          </p>

          {[
            [
              'Anonymous person tracking',
              'ON'
            ],
            [
              'Continuous video retention',
              'OFF'
            ],
            [
              'Event-based storage',
              'ON'
            ]
          ].map((x) => (

            <div
              className="setting-row"
              key={x[0]}
            >

              <span>

                <b>{x[0]}</b>

                <small>
                  {x[1] === 'ON'
                    ? 'Use anonymous IDs to connect events over time.'
                    : 'Video is processed and discarded after analysis.'}
                </small>

              </span>

              <button
                className={`switch ${
                  x[1] === 'ON'
                    ? 'on'
                    : ''
                }`}
                onClick={toggle}
              >
                <i />
              </button>

            </div>

          ))}

        </section>

        <section className="panel zones">

          <div className="panel-head">

            <div>

              <p className="eyebrow">
                ENVIRONMENT
              </p>

              <h3>
                Monitored zones
              </h3>

            </div>

            <button className="secondary-btn">
              + Add zone
            </button>

          </div>

          {[
            ['Workspace A', 'Normal'],
            ['Workspace B', 'Restricted'],
            ['Laboratory', 'Restricted'],
            ['Warehouse', 'Normal']
          ].map((x) => (

            <div
              className="zone-row"
              key={x[0]}
            >

              <div className="zone-icon">
                <Video size={16} />
              </div>

              <span>{x[0]}</span>

              <Badge
                severity={
                  x[1] === 'Restricted'
                    ? 'MEDIUM'
                    : 'INFO'
                }
              >
                {x[1]}
              </Badge>

              <MoreHorizontal size={16} />

            </div>

          ))}

        </section>

      </div>
    </>
  )
}

/* =========================================================
   PROFILE
   ========================================================= */

function Profile() {
  const [name, setName] =
    useState('Operator')

  const [org, setOrg] =
    useState('SENSE Environment')

  const [saved, setSaved] =
    useState(false)

  const [email, setEmail] =
    useState('')

  useEffect(() => {

    const loadProfile = async () => {

      const { data } =
        await supabase.auth.getUser()

      if (data.user) {

        setName(
          data.user.user_metadata?.full_name ||
          data.user.email?.split('@')[0] ||
          'Operator'
        )

        setEmail(
          data.user.email || ''
        )

      }

    }

    loadProfile()

  }, [])

  const saveProfile = async () => {

    const { error } =
      await supabase.auth.updateUser({
        data: {
          full_name: name,
          organization: org
        }
      })

    if (!error) {

      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 2000)

    }

  }

  const initials =
    name
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <>
      <PageHeader
        eyebrow="ACCOUNT / PROFILE"
        title="Operator profile"
        sub="Manage your identity and workspace preferences."
      />

      <div className="profile-grid">

        <section className="panel profile-card">

          <div className="profile-hero">

            <div className="profile-avatar">
              {initials}
            </div>

            <div>

              <h2>{name}</h2>

              <p>
                {email}
              </p>

              <Badge>
                Environment Operator
              </Badge>

            </div>

          </div>

          <div className="profile-form">

            <label>
              Full name

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </label>

            <label>
              Organization

              <input
                value={org}
                onChange={(e) =>
                  setOrg(e.target.value)
                }
              />
            </label>

            <button
              className="primary-btn"
              onClick={saveProfile}
            >
              {saved ? (
                <>
                  <Check size={15} />
                  Profile updated.
                </>
              ) : (
                'Save profile'
              )}
            </button>

          </div>

        </section>

        <section className="panel">

          <p className="eyebrow">
            WORKSPACE
          </p>

          <h3>
            System status
          </h3>

          <div className="system-list profile-status">

            {[
              'Vision Engine',
              'Event Engine',
              'Database',
              'WebSocket',
              'Nemotron',
              'Nebius'
            ].map((x) => (

              <div key={x}>

                <span>{x}</span>

                <b>
                  <i /> CONNECTED
                </b>

              </div>

            ))}

          </div>

        </section>

      </div>
    </>
  )
}

/* =========================================================
   MAIN ROUTER + SUPABASE SESSION
   ========================================================= */

export default function Page() {

  const path = usePathname()
  const router = useRouter()

  const [demo, setDemo] =
    useState(false)

  const [session, setSession] =
    useState<any>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    let mounted = true

    const loadSession = async () => {

      const { data } =
        await supabase.auth.getSession()

      if (!mounted) return

      setSession(data.session)
      setLoading(false)
    }

    loadSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {

        if (!mounted) return

        setSession(newSession)
      }
    )

    return () => {

      mounted = false

      subscription.unsubscribe()

    }

  }, [])

  if (loading) {
    return null
  }

  const publicPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/forgot-password'

  /* AUTHENTICATION PAGES */

  if (publicPath) {

    return (
      <Auth
        mode={
          path === '/signup'
            ? 'signup'
            : path === '/forgot-password'
              ? 'forgot'
              : 'login'
        }
      />
    )
  }

  /* PROTECT APPLICATION */

  if (!session) {

    router.replace('/login')

    return null
  }

  let page: React.ReactNode

  if (path === '/') {

    page = (
      <CommandCenter
        startDemo={demo}
        onDemo={setDemo}
      />
    )

  } else if (path === '/live') {

    page = <Live />

  } else if (path === '/events') {

    page = <Events />

  } else if (path === '/alerts') {

    page = <Alerts />

  } else if (path === '/investigations') {

    page = <Investigations />

  } else if (
    path?.startsWith('/investigations/')
  ) {

    page = <Investigations detail />

  } else if (path === '/assistant') {

    page = <Assistant />

  } else if (path === '/analytics') {

    page = <Analytics />

  } else if (path === '/configuration') {

    page = <Configuration />

  } else if (path === '/profile') {

    page = <Profile />

  } else {

    page = (
      <CommandCenter
        startDemo={demo}
        onDemo={setDemo}
      />
    )
  }

  return (
    <AppShell>
      {page}
    </AppShell>
  )
}