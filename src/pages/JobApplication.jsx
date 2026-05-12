import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import emailjs from '@emailjs/browser';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Phone, Mail, MapPin, Briefcase, Upload, FileText,
  Camera, CheckCircle, AlertCircle, Loader2, Gem, Calendar
} from 'lucide-react';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_RESUME = ['.pdf', '.doc', '.docx'];
const ALLOWED_IMAGE = ['.jpg', '.jpeg', '.png', '.webp'];

function generateCaptcha() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  return { question: `${a} + ${b} = ?`, answer: a + b };
}

function validateFile(file, allowedExts, label) {
  if (!file) return `${label} is required`;
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExts.includes(ext)) return `${label}: Invalid file type. Allowed: ${allowedExts.join(', ')}`;
  if (file.size > MAX_FILE_SIZE) return `${label}: File too large. Max 5MB`;
  return null;
}

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gold-200">
    <div className="w-9 h-9 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center">
      <Icon className="w-4 h-4" />
    </div>
    <h3 className="text-lg font-serif font-bold text-maroon-950">{title}</h3>
  </div>
);

const Input = ({ label, required, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm"
    />
  </div>
);

const Select = ({ label, required, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm"
    >
      {children}
    </select>
  </div>
);

const FileInput = ({ label, required, accept, helpText, onChange, id }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      required={required}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 file:cursor-pointer border border-gray-300 bg-gray-50 p-2"
    />
    {helpText && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
  </div>
);

const JobApplication = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef();
  const { currentUser, googleSignIn, logout } = useAuth();
  const preselectedRole = searchParams.get('role') || '';
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '', fatherName: '', dob: '', gender: '', maritalStatus: '',
    mobile: '', whatsapp: '', email: '',
    address: '', city: '', state: '', pincode: '',
    qualification: '', experience: '', previousCompany: '', skills: '', expectedSalary: '',
    motivation: '', joiningDate: '', appliedRole: preselectedRole,
  });

  const [files, setFiles] = useState({ resume: null, aadharFront: null, aadharBack: null, photo: null });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  // Auto-fill email from Google account
  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setSignInError('');
    try {
      const result = await googleSignIn();
      const user = result.user;
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: prev.fullName || user.displayName || '',
      }));
    } catch (err) {
      console.error('Google sign-in error:', err);
      setSignInError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (key) => (e) => {
    if (e.target.files[0]) setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
  };

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('');
    setErrorMsg('');

    // Validate CAPTCHA
    if (parseInt(captchaInput) !== captcha.answer) {
      setErrorMsg('Incorrect CAPTCHA answer. Please try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    if (!consent) {
      setErrorMsg('Please confirm that all information provided is correct.');
      return;
    }

    // Validate files
    const fileErrors = [
      validateFile(files.resume, ALLOWED_RESUME, 'Resume'),
      validateFile(files.aadharFront, ALLOWED_IMAGE, 'Aadhar Front'),
      validateFile(files.aadharBack, ALLOWED_IMAGE, 'Aadhar Back'),
      validateFile(files.photo, ALLOWED_IMAGE, 'Photo'),
    ].filter(Boolean);

    if (fileErrors.length > 0) {
      setErrorMsg(fileErrors.join('\n'));
      return;
    }

    setSubmitting(true);

    try {
      const timestamp = Date.now();
      const safeName = formData.fullName.replace(/\s+/g, '_').toLowerCase();

      setUploadProgress('Uploading resume...');
      const resumeUrl = await uploadFile(files.resume, `applications/${safeName}_${timestamp}/resume_${files.resume.name}`);

      setUploadProgress('Uploading Aadhar (front)...');
      const aadharFrontUrl = await uploadFile(files.aadharFront, `applications/${safeName}_${timestamp}/aadhar_front_${files.aadharFront.name}`);

      setUploadProgress('Uploading Aadhar (back)...');
      const aadharBackUrl = await uploadFile(files.aadharBack, `applications/${safeName}_${timestamp}/aadhar_back_${files.aadharBack.name}`);

      setUploadProgress('Uploading photo...');
      const photoUrl = await uploadFile(files.photo, `applications/${safeName}_${timestamp}/photo_${files.photo.name}`);

      setUploadProgress('Saving application...');
      await addDoc(collection(db, 'jobApplications'), {
        ...formData,
        resumeUrl, aadharFrontUrl, aadharBackUrl, photoUrl,
        status: 'Pending',
        adminNotes: '',
        consent: true,
        createdAt: serverTimestamp(),
      });

      // Send confirmation emails via EmailJS
      setUploadProgress('Sending confirmation emails...');
      try {
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const CAREERS_TEMPLATE = import.meta.env.VITE_EMAILJS_CAREERS_TEMPLATE_ID;

        if (SERVICE_ID && PUBLIC_KEY && CAREERS_TEMPLATE) {
          await emailjs.send(SERVICE_ID, CAREERS_TEMPLATE, {
            to_email: formData.email,
            applicant_name: formData.fullName,
            applied_role: formData.appliedRole || 'General Application',
            reply_to: 'sgvjewellers1938@gmail.com',
          }, PUBLIC_KEY);
        }
      } catch (emailErr) {
        console.warn('Email notification failed (non-critical):', emailErr);
      }

      setSubmitStatus('SUCCESS');
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'Failed to submit application. Please try again.');
      setSubmitStatus('ERROR');
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  // ── Google Login Gate ──
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet><title>Sign In to Apply | SGV Jewellers Careers</title></Helmet>
        <div className="bg-maroon-950 text-white py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 30% 50%, rgba(212,170,30,0.3) 0%, transparent 50%)` }}></div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gem className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 uppercase tracking-[0.2em] text-sm">Application Form</span>
              <Gem className="w-5 h-5 text-gold-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Apply for {preselectedRole || 'a Position'}</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">Sign in with your Google account to continue</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
        </div>
        <div className="flex items-center justify-center px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 shadow-lg border border-gold-200 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-gold-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-maroon-950 mb-3">Sign In to Apply</h2>
            <p className="text-gray-500 text-sm mb-8">Sign in with your Google account to securely submit your application and upload documents.</p>
            {signInError && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 border border-red-200 rounded">{signInError}</p>}
            <button onClick={handleGoogleSignIn} disabled={signingIn} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gold-500 px-6 py-3.5 rounded-lg font-medium text-maroon-950 transition-all hover:shadow-md disabled:opacity-50">
              {signingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
              {signingIn ? 'Signing in...' : 'Continue with Google'}
            </button>
            <p className="text-xs text-gray-400 mt-6">Your email will be auto-filled from your Google account</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (submitStatus === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Helmet><title>Application Submitted | SGV Jewellers Careers</title></Helmet>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 shadow-lg border border-gold-200 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-maroon-950 mb-3">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you, <strong>{formData.fullName}</strong>. Your application for <strong>{formData.appliedRole || 'General Application'}</strong> has been received.</p>
          <p className="text-sm text-gray-500 mb-8">A confirmation email has been sent to {formData.email}</p>
          <button onClick={() => { logout(); navigate('/careers'); }} className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 font-medium uppercase tracking-wider transition-all">Back to Careers</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Apply Now | SGV Jewellers Careers</title>
        <meta name="description" content="Apply for a career at Shree Gopaldas Vallabhdas Jewellers. Fill out the application form to join our team." />
      </Helmet>

      {/* Header */}
      <div className="bg-maroon-950 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(212,170,30,0.3) 0%, transparent 50%)`
        }}></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gem className="w-5 h-5 text-gold-400" />
            <span className="text-gold-400 uppercase tracking-[0.2em] text-sm">Application Form</span>
            <Gem className="w-5 h-5 text-gold-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            Apply for {preselectedRole || 'a Position'}
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Complete the form below to submit your application. All fields marked with * are required.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">

          {/* Role Selection */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={Briefcase} title="Position" />
            <Select label="Applying For" required name="appliedRole" value={formData.appliedRole} onChange={handleChange}>
              <option value="">Select a role</option>
              <option value="Sales + Marketing Executive">Sales + Marketing Executive</option>
              <option value="Marketing + Accounting Executive">Marketing + Accounting Executive</option>
              <option value="Sales + Accounting Executive">Sales + Accounting Executive</option>
              <option value="General Application">General Application</option>
            </Select>
          </div>

          {/* Personal Details */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={User} title="Personal Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
              <Input label="Father's Name" required name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" />
              <Input label="Date of Birth" required name="dob" type="date" value={formData.dob} onChange={handleChange} />
              <Select label="Gender" required name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
              <Select label="Marital Status" required name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </Select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={Phone} title="Contact Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Mobile Number" required name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="+91" pattern="[0-9]{10}" title="Enter 10 digit mobile number" />
              <Input label="WhatsApp Number" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} placeholder="+91 (if different)" />
              <div className="md:col-span-2">
                <Input label="Email Address" required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={MapPin} title="Address Details" />
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Residential Address <span className="text-red-500">*</span></label>
                <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" placeholder="House/Flat No., Street, Area, Landmark" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input label="City" required name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Burhanpur" />
                <Select label="State" required name="state" value={formData.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Input label="Pincode" required name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 450331" pattern="[0-9]{6}" title="Enter 6 digit pincode" />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={Briefcase} title="Professional Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Highest Qualification" required name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. B.Com, MBA" />
              <Input label="Years of Experience" required name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 2 years or Fresher" />
              <Input label="Current / Previous Company" name="previousCompany" value={formData.previousCompany} onChange={handleChange} placeholder="Company name (if any)" />
              <Input label="Expected Salary (₹/month)" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} placeholder="e.g. ₹15,000" />
              <div className="md:col-span-2">
                <Input label="Skills" required name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Sales, Tally, MS Excel, Communication" />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={Upload} title="Document Uploads" />
            <p className="text-xs text-gray-500 mb-5 -mt-3">Maximum file size: 5MB per file</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FileInput id="resume" label="Resume" required accept=".pdf,.doc,.docx" helpText="PDF, DOC, DOCX only" onChange={handleFileChange('resume')} />
              <FileInput id="photo" label="Passport Size Photo" required accept=".jpg,.jpeg,.png,.webp" helpText="JPG, PNG, WEBP only" onChange={handleFileChange('photo')} />
              <FileInput id="aadharFront" label="Aadhar Card (Front)" required accept=".jpg,.jpeg,.png,.webp" helpText="JPG, PNG, WEBP only" onChange={handleFileChange('aadharFront')} />
              <FileInput id="aadharBack" label="Aadhar Card (Back)" required accept=".jpg,.jpeg,.png,.webp" helpText="JPG, PNG, WEBP only" onChange={handleFileChange('aadharBack')} />
            </div>
          </div>

          {/* Additional Inputs */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={FileText} title="Additional Information" />
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join us? <span className="text-red-500">*</span></label>
                <textarea name="motivation" required value={formData.motivation} onChange={handleChange} rows="4" placeholder="Tell us why you'd like to work at SGV Jewellers..." className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm" />
              </div>
              <Input label="Available Joining Date" required name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
            </div>
          </div>

          {/* CAPTCHA & Consent */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <SectionTitle icon={CheckCircle} title="Verification" />
            <div className="space-y-6">
              {/* Simple CAPTCHA */}
              <div className="bg-gold-50 border border-gold-200 p-4 rounded">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solve: <span className="font-bold text-maroon-950 text-base">{captcha.question}</span>
                </label>
                <input
                  type="number"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                  placeholder="Your answer"
                  className="w-32 px-4 py-2 border border-gray-300 focus:border-gold-500 outline-none text-sm"
                />
              </div>
              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-gold-500" />
                <span className="text-sm text-gray-700">
                  I confirm that all information provided is correct and I consent to the processing of my personal data for recruitment purposes.
                </span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm whitespace-pre-line">{errorMsg}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            {uploadProgress && (
              <p className="text-gold-600 text-sm mb-3 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> {uploadProgress}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-gold-500 hover:bg-gold-600 text-white px-12 py-4 font-medium uppercase tracking-wider text-sm transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><FileText className="w-4 h-4" /> Submit Application</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;
