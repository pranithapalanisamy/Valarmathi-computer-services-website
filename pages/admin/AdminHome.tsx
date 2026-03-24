import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import {
  Calendar, Clock, AlertTriangle,
  Plus, UserPlus, FileText, CalendarCheck,
  CheckCircle, Circle, Play,
  Wrench, Monitor, HardDrive, Wifi,
  ChevronRight
} from "lucide-react";

// Firebase references
const todayScheduleRef = ref(db, 'todaySchedule');
const activeJobsRef = ref(db, 'activeJobs');
const quickActionsRef = ref(db, 'quickActions');

const quickActions = [
  {
    icon: Plus,
    label: "Create Service Request",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    path: "/admin/orders/new"
  },
  {
    icon: UserPlus,
    label: "Add New Customer",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    path: "/admin/users/new"
  },
  {
    icon: FileText,
    label: "Generate Quote",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    path: "/admin/quotes/new"
  },
  {
    icon: CalendarCheck,
    label: "Schedule Booking",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    path: "/admin/bookings/new"
  }
];

const serviceIcons: Record<string, any> = {
  "Laptop Screen Repair": Monitor,
  "Data Recovery": HardDrive,
  "RAM Upgrade": Wrench,
  "Antivirus Setup": Wifi,
};

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    "Completed": {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
      iconColor: "text-emerald-600"
    },
    "In Progress": {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Play,
      iconColor: "text-blue-600"
    },
    "Pending": {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Circle,
      iconColor: "text-amber-600"
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <Icon className={`h-3 w-3 ${config.iconColor}`} />
      {status}
    </span>
  );
}

export default function AdminHome() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  
  // Added state to hold Firebase data
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [currentTime]);

  // Added useEffect to fetch Firebase data
  useEffect(() => {
    const unsubscribeSchedule = onValue(todayScheduleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const scheduleList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTodaySchedule(scheduleList);
      } else {
        setTodaySchedule([]);
      }
    });

    const unsubscribeJobs = onValue(activeJobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jobsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setActiveJobs(jobsList);
      } else {
        setActiveJobs([]);
      }
    });

    return () => {
      unsubscribeSchedule();
      unsubscribeJobs();
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src="/vc-logo.png"
              alt="Valarmathi Computers"
              className="h-14 w-14 object-contain animate-pulse"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500" />
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">VALARMATHI COMPUTERS</p>
            <p className="text-xs text-slate-400 mt-0.5">Loading Admin Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = todaySchedule.filter(job => job.status === "Completed").length;
  const inProgressCount = todaySchedule.filter(job => job.status === "In Progress").length;
  const pendingCount = todaySchedule.filter(job => job.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{greeting} Admin!</h1>
            <p className="text-blue-100 mb-4">You have 2 urgent items that need your attention today</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{todaySchedule.length} jobs scheduled today</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold mb-1">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-blue-100">LIVE</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Today's Jobs</p>
                <p className="text-2xl font-bold text-white">{todaySchedule.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Urgent Issues</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button" // <--- Added type="button" to prevent native page reloads
              onClick={() => navigate(action.path)}
              className={`p-4 rounded-xl border border-gray-200 ${action.color} ${action.hoverColor} text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group`}
            >
              <action.icon className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <p className="text-sm text-gray-500">
              {completedCount} completed, {inProgressCount} in progress, {pendingCount} pending
            </p>
          </div>
          <button 
            type="button" // <--- Added type="button" here as well
            onClick={() => navigate("/admin/bookings")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {todaySchedule.length > 0 ? todaySchedule.map((job) => {
            const ServiceIcon = serviceIcons[job.service] || Wrench;
            return (
              <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ServiceIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{job.service}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.time}
                        </span>
                        <span>{job.customer}</span>
                        <span>{job.technician}</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-gray-500 py-4 text-center border border-dashed rounded-lg">No jobs scheduled for today.</p>
          )}
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
            <p className="text-sm text-gray-500">{activeJobs.length} jobs currently in progress</p>
          </div>
        </div>

        <div className="space-y-4">
          {activeJobs.length > 0 ? activeJobs.map((job) => {
            const ServiceIcon = serviceIcons[job.service] || Wrench;
            return (
              <div key={job.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ServiceIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{job.service}</p>
                      <p className="text-sm text-gray-500">{job.customer} • {job.technician}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{job.progress}%</p>
                    <p className="text-xs text-gray-500">Est. {job.estimatedTime}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-gray-500 py-4 text-center border border-dashed rounded-lg">No active jobs at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}