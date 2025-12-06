'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Phone, MapPin, Mail, Home, Calendar, ChevronRight, Check, AlertCircle, Loader2, LogIn, Building } from 'lucide-react';

// Governorate options (Lebanese governorates)
const GOVERNORATES = [
  { value: 'mount-lebanon-1', labelEn: 'Mount Lebanon 1', labelAr: 'جبل لبنان 1' },
  { value: 'mount-lebanon-2', labelEn: 'Mount Lebanon 2', labelAr: 'جبل لبنان 2' },
  { value: 'mount-lebanon-3', labelEn: 'Mount Lebanon 3', labelAr: 'جبل لبنان 3' },
  { value: 'mount-lebanon-4', labelEn: 'Mount Lebanon 4', labelAr: 'جبل لبنان 4' },
  { value: 'baalbak-hermel', labelEn: 'Baalbak/Hermel', labelAr: 'بعلبك الهرمل' },
  { value: 'north', labelEn: 'North', labelAr: 'الشمال' },
  { value: 'south', labelEn: 'South', labelAr: 'الجنوب' },
  { value: 'bekaa', labelEn: 'Bekaa', labelAr: 'البقاع' },
  { value: 'beirut', labelEn: 'Beirut', labelAr: 'بيروت' },
];

// Electoral District options (Lebanese electoral districts)
const ELECTORAL_DISTRICTS = [
  { value: 'akkar', labelEn: 'Akkar', labelAr: 'عكار' },
  { value: 'aley', labelEn: 'Aley', labelAr: 'عاليه' },
  { value: 'baabda', labelEn: 'Baabda', labelAr: 'بعبدا' },
  { value: 'baalback', labelEn: 'Baalback', labelAr: 'بعلبك' },
  { value: 'batroun', labelEn: 'Batroun', labelAr: 'البترون' },
  { value: 'bcharre', labelEn: 'Bcharre', labelAr: 'بشري' },
  { value: 'beirut', labelEn: 'Beirut', labelAr: 'بيروت' },
  { value: 'bint-jbeil', labelEn: 'Bint Jbeil', labelAr: 'بنت جبيل' },
  { value: 'chouf', labelEn: 'Chouf', labelAr: 'الشوف' },
  { value: 'el-metn', labelEn: 'El Metn', labelAr: 'المتن' },
  { value: 'hasbaya', labelEn: 'Hasbaya', labelAr: 'حاصبيا' },
  { value: 'hermel', labelEn: 'Hermel', labelAr: 'الهرمل' },
  { value: 'jbeil', labelEn: 'Jbeil', labelAr: 'جبيل' },
  { value: 'jezzine', labelEn: 'Jezzine', labelAr: 'جزين' },
  { value: 'kesserwan', labelEn: 'Kesserwan', labelAr: 'كسروان' },
  { value: 'koura', labelEn: 'Koura', labelAr: 'الكورة' },
  { value: 'marjaayoun', labelEn: 'Marjaayoun', labelAr: 'مرجعيون' },
  { value: 'minnieh-donniyeh', labelEn: 'Minnieh-Donniyeh', labelAr: 'المنية - الضنية' },
  { value: 'nabatieh', labelEn: 'Nabatieh', labelAr: 'النبطية' },
  { value: 'rashaya', labelEn: 'Rashaya', labelAr: 'راشيا' },
  { value: 'rashaya-al-fekhar', labelEn: 'Rashaya Al Fekhar', labelAr: 'راشيا الفخار' },
  { value: 'saida', labelEn: 'Saida', labelAr: 'صيدا' },
  { value: 'sour', labelEn: 'Sour', labelAr: 'صور' },
  { value: 'tripoli', labelEn: 'Tripoli', labelAr: 'طرابلس' },
  { value: 'west-beqaa', labelEn: 'West Beqaa', labelAr: 'البقاع الغربي' },
  { value: 'zahle', labelEn: 'Zahle', labelAr: 'زحلة' },
  { value: 'zgharta', labelEn: 'Zgharta', labelAr: 'زغرتا' },
];

type Mode = 'register' | 'login';
type Step = 'code' | 'registration';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('register');
  const [step, setStep] = useState<Step>('code');
  const [code, setCode] = useState('');
  const [, setCodeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Registration form state
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [electoralDistrict, setElectoralDistrict] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          window.location.href = '/en';
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid access code');
        setIsLoading(false);
        return;
      }

      setCodeId(data.codeId);
      setStep('registration');
    } catch (error) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate age
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 120) {
      setError('Please enter a valid age (16-120)');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          fullName,
          age: ageNum,
          contactNumber,
          emailAddress,
          governorate,
          electoralDistrict,
          currentAddress,
          privacyConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      window.location.href = '/en';
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          code: loginCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'Login successful!');
      setTimeout(() => {
        window.location.href = '/en';
      }, 1000);
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setSuccessMessage('');
    setStep('code');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center mb-8 relative z-10"
      >
        <Image 
          src="/5050 Logo.png" 
          alt="FiftyFifty Logo" 
          width={120} 
          height={120}
          className="h-24 sm:h-28 w-auto object-contain"
        />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0063AF] to-[#004080] p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
              className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
            >
              {mode === 'login' ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === 'login' 
                ? 'Welcome Back' 
                : step === 'code' 
                  ? 'Welcome' 
                  : 'Almost there!'}
            </h1>
            <p className="text-blue-100 text-sm">
              {mode === 'login'
                ? 'Sign in with your email and access code'
                : step === 'code' 
                  ? 'Enter your access code to get started' 
                  : 'Please provide your details to continue'}
            </p>
          </div>

          {/* Mode Toggle - Only show in register mode at code step */}
          {mode === 'register' && step === 'code' && (
            <div className="flex items-center justify-center gap-3 py-4 bg-gray-50/50">
              <div className={`flex items-center gap-2 text-[#0063AF]`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-[#0063AF] text-white">
                  1
                </div>
                <span className="text-sm font-medium hidden sm:inline">Access Code</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-200 text-gray-500">
                  2
                </div>
                <span className="text-sm font-medium hidden sm:inline">Your Details</span>
              </div>
            </div>
          )}

          {/* Step Indicators for registration */}
          {mode === 'register' && step === 'registration' && (
            <div className="flex items-center justify-center gap-3 py-4 bg-gray-50/50">
              <div className="flex items-center gap-2 text-green-500">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-green-500 text-white">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">Access Code</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 text-[#0063AF]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-[#0063AF] text-white">
                  2
                </div>
                <span className="text-sm font-medium hidden sm:inline">Your Details</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{successMessage}</p>
                </motion.div>
              )}

              {/* LOGIN MODE */}
              {mode === 'login' && (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="loginEmail"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="loginCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Access Code
                    </label>
                    <div className="relative">
                      <input
                        id="loginCode"
                        type="text"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                        placeholder="Enter your access code"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                        autoComplete="off"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !loginEmail || !loginCode}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#0063AF] to-[#004080] text-white font-semibold rounded-xl hover:from-[#005090] hover:to-[#003060] focus:ring-4 focus:ring-[#0063AF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <LogIn className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Don&apos;t have an account? <span className="text-[#0063AF] font-medium">Register</span>
                  </button>
                </motion.form>
              )}

              {/* REGISTER MODE - Code Step */}
              {mode === 'register' && step === 'code' && (
                <motion.form
                  key="code-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyCode}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                      Access Code
                    </label>
                    <div className="relative">
                      <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter your access code"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                        autoComplete="off"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !code.trim()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#0063AF] to-[#004080] text-white font-semibold rounded-xl hover:from-[#005090] hover:to-[#003060] focus:ring-4 focus:ring-[#0063AF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Already registered? <span className="text-[#0063AF] font-medium">Sign In</span>
                  </button>
                </motion.form>
              )}

              {/* REGISTER MODE - Registration Step */}
              {mode === 'register' && step === 'registration' && (
                <motion.form
                  key="registration-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name / الاسم الكامل *
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age / العمر *
                    </label>
                    <div className="relative">
                      <input
                        id="age"
                        type="number"
                        min="16"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number / رقم الهاتف *
                    </label>
                    <div className="relative">
                      <input
                        id="contactNumber"
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address / البريد الالكتروني *
                    </label>
                    <div className="relative">
                      <input
                        id="emailAddress"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Governorate */}
                  <div>
                    <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-2">
                      Governorate / المحافظة (النفوس) *
                    </label>
                    <div className="relative">
                      <select
                        id="governorate"
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select governorate / اختر المحافظة</option>
                        {GOVERNORATES.map((gov) => (
                          <option key={gov.value} value={gov.value}>
                            {gov.labelEn} | {gov.labelAr}
                          </option>
                        ))}
                      </select>
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
                    </div>
                  </div>

                  {/* Electoral District */}
                  <div>
                    <label htmlFor="electoralDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                      Electoral District / دائرة النفوس *
                    </label>
                    <div className="relative">
                      <select
                        id="electoralDistrict"
                        value={electoralDistrict}
                        onChange={(e) => setElectoralDistrict(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select electoral district / اختر دائرة النفوس</option>
                        {ELECTORAL_DISTRICTS.map((district) => (
                          <option key={district.value} value={district.value}>
                            {district.labelEn} | {district.labelAr}
                          </option>
                        ))}
                      </select>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
                    </div>
                  </div>

                  {/* Current Address */}
                  <div>
                    <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Address / مكان السكن الحالي *
                    </label>
                    <div className="relative">
                      <input
                        id="currentAddress"
                        type="text"
                        value={currentAddress}
                        onChange={(e) => setCurrentAddress(e.target.value)}
                        placeholder="Enter your current address"
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0063AF] focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        required
                      />
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Privacy Consent */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={privacyConsent}
                          onChange={(e) => setPrivacyConsent(e.target.checked)}
                          className="sr-only peer"
                          required
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-[#0063AF] peer-checked:border-[#0063AF] transition-all">
                          {privacyConsent && (
                            <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I consent to my data being stored and used for program purposes. 
                        My information will be kept confidential and secure.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !fullName || !age || !contactNumber || !emailAddress || !governorate || !electoralDistrict || !currentAddress || !privacyConsent}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#0063AF] to-[#004080] text-white font-semibold rounded-xl hover:from-[#005090] hover:to-[#003060] focus:ring-4 focus:ring-[#0063AF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Enter ToolKit
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('code');
                      setError('');
                    }}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Use a different code
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have a code? Contact your program coordinator for access.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 relative z-10"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium text-[#0063AF]">EN</span>
          <span className="text-gray-400">|</span>
          <button 
            onClick={() => window.location.href = '/ar'}
            className="hover:text-[#0063AF] transition-colors"
          >
            العربية
          </button>
        </div>
      </motion.div>
    </div>
  );
}
