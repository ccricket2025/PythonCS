import React, { useState } from 'react';
import {
  Terminal,
  Github,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  AlertTriangle,
  FileKey,
  Flame,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export function AndroidBuildGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'github' | 'wsl' | 'deploy' | 'troubleshoot'>('github');

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> Android Compilation Pipeline
          </span>
          <h2 className="text-xl font-bold">Android APK Build & Deployment Guide</h2>
          <p className="text-stone-300 text-xs max-w-2xl leading-relaxed">
            Python-for-Android ও Buildozer দিয়ে পূর্ণাঙ্গ Android APK কম্পাইল করার বিস্তারিত গাইড। কোনো ভারী সেটআপ ছাড়াই GitHub Actions ক্লাউড রানার দিয়ে অথবা আপনার লোকাল লিনাক্স/WSL2 মেশিনে বিল্ড করতে পারেন।
          </p>
        </div>

        {/* Navigation sub-tabs */}
        <div className="bg-stone-800 p-1 rounded-xl flex items-center gap-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'github' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            GitHub Actions (Cloud)
          </button>
          <button
            onClick={() => setActiveTab('wsl')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'wsl' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            WSL2 / Ubuntu (Local)
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'deploy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            USB Run & Signing
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'troubleshoot' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Troubleshooting
          </button>
        </div>
      </div>

      {/* Tab 1: GitHub Actions */}
      {activeTab === 'github' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <Github className="w-4 h-4" />
              </div>
              <span>পদ্ধতি ১: GitHub Actions দিয়ে অটোমেটিক APK তৈরি (সবচেয়ে সহজ ও রেকমেন্ডেড)</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              আপনার লোকাল পিসিতে কোনো ভারী Android Studio, NDK বা লিনাক্স ইন্সটল করার প্রয়োজন নেই। প্রজেক্টে <code className="bg-stone-100 px-1.5 py-0.5 rounded text-teal-800 font-mono font-semibold">.github/workflows/build-apk.yml</code> তৈরি রয়েছে।
            </p>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">১</span>
                  গিটহাবে রিপোজিটরি তৈরি ও কোড পুশ করুন:
                </span>
                <p className="text-stone-500 text-[11px]">
                  প্রথমে GitHub-এ একটি নতুন রিপোজিটরি (যেমন: <code className="font-mono">CamScannerPython</code>) খুলুন। এরপর প্রজেক্ট ফোল্ডারে টার্মিনালে নিচের কমান্ডগুলো দিন:
                </p>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-[11px] relative group">
                  <pre>{`git init
git add .
git commit -m "Initial commit: CamScanner Python Android App"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/CamScannerPython.git
git push -u origin main`}</pre>
                  <button
                    onClick={() => copySnippet(`git init\ngit add .\ngit commit -m "Initial commit: CamScanner Python Android App"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_GITHUB_USERNAME/CamScannerPython.git\ngit push -u origin main`, 1)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">২</span>
                  GitHub Actions ট্যাবে বিল্ড অগ্রগতি পর্যবেক্ষণ করুন:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  কোড পুশ হওয়ার সাথে সাথে GitHub Actions রানার Ubuntu 22.04 ইনস্ট্যান্সে Buildozer, Android SDK/NDK, KivyMD ও OpenCV কম্পাইল করা শুরু করবে। পুরো বিল্ড সম্পন্ন হতে প্রায় ১৫–২০ মিনিট সময় নেয়।
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-2">
                <span className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">৩</span>
                  তৈরি হওয়া APK ডাউনলোড ও ফোনে ইনস্টল করুন:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  বিল্ড শেষ হলে সবুজ চেকমার্ক দেখাবে। পেইজের নিচের <strong>Artifacts</strong> সেকশন থেকে <span className="font-mono font-semibold text-teal-800">CamScanner-Android-APK</span> জিপ ফাইলটি ডাউনলোড করে ফোনে নিয়ে ইনস্টল করে নিন।
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ক্লাউড বিল্ডের সুবিধা</span>
              </div>
              <ul className="text-[11px] text-emerald-800 space-y-2 leading-relaxed">
                <li>• পিসিতে ২৫-৩০ জিবি NDK/SDK স্টোরেজ দরকার হয় না।</li>
                <li>• র‍্যাম কম বা উইন্ডোজ অপারেটিং সিস্টেমে কোনো কনফ্লিক্ট তৈরি হয় না।</li>
                <li>• যেকোনো সময় যেকোনো ডিভাইসে গিট পুশ করলেই নতুন APK তৈরি হয়।</li>
              </ul>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-stone-900">ইনস্টলেশন পারমিশন নোট</span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                অ্যান্ড্রয়েড ফোনে ইনস্টল করার সময় &quot;Install from unknown sources&quot; পারমিশন দিন। অ্যাপটিতে <code className="font-mono text-teal-700">CAMERA</code> ও <code className="font-mono text-teal-700">WRITE_EXTERNAL_STORAGE</code> পারমিশন প্রথমবার খোলার সময় রিকোয়েস্ট করা হবে।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Local WSL2 / Ubuntu */}
      {activeTab === 'wsl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <Terminal className="w-4 h-4" />
              </div>
              <span>পদ্ধতি ২: লোকাল পিসিতে (WSL2 / Ubuntu 22.04) বিল্ড করার কমান্ড</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              আপনি যদি লোকাল ডেভেলপমেন্ট ও দ্রুত কোড এডিটিং করতে চান, তবে লিনাক্স বা উইন্ডোজ WSL2 (Ubuntu 22.04 LTS) ব্যবহার করে নিচে উল্লেখিত স্টেপগুলো অনুসরণ করুন:
            </p>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-stone-800">ধাপ ১: লিনাক্স বিল্ড ডিপেন্ডেন্সি ও লাইব্রেরি ইনস্টল</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`sudo apt update && sudo apt install -y \\
  python3-pip python3-venv git zip unzip openjdk-17-jdk \\
  autoconf automake libtool pkg-config zlib1g-dev \\
  libncurses5-dev cmake libffi-dev libssl-dev libsqlite3-dev`}</pre>
                  <button
                    onClick={() => copySnippet(`sudo apt update && sudo apt install -y python3-pip python3-venv git zip unzip openjdk-17-jdk autoconf automake libtool pkg-config zlib1g-dev libncurses5-dev cmake libffi-dev libssl-dev libsqlite3-dev`, 2)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">ধাপ ২: ভার্চুয়াল এনভায়রনমেন্ট ও বিল্ডোজার ইনস্টল</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install buildozer cython==0.29.36`}</pre>
                  <button
                    onClick={() => copySnippet(`python3 -m venv venv\nsource venv/bin/activate\npip install --upgrade pip setuptools wheel\npip install buildozer cython==0.29.36`, 3)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">ধাপ ৩: APK কম্পাইল ও জেনারেশন</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`buildozer -v android debug`}</pre>
                  <button
                    onClick={() => copySnippet(`buildozer -v android debug`, 4)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  কম্পাইলেশন সফল হলে APK ফাইলটি প্রজেক্টের <code className="font-mono text-teal-800 font-semibold">bin/</code> ফোল্ডারে জমা হবে (যেমন: <code className="font-mono">camscanner-0.1.0-arm64-v8a-debug.apk</code>)।
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
            <span className="text-xs font-bold text-stone-900">হার্ডওয়্যার রিকোয়ারমেন্টস</span>
            <ul className="text-xs text-stone-600 space-y-2">
              <li>• <strong>র‍্যাম:</strong> কমপক্ষে 8GB RAM (16GB রেকমেন্ডেড)</li>
              <li>• <strong>ডিস্ক স্পেস:</strong> কমপক্ষে 20GB ফ্রি স্পেস (Android SDK, NDK ও পাইথন রেসিপি ক্যাশিংয়ের জন্য)</li>
              <li>• <strong>ইন্টারনেট:</strong> প্রথমবার বিল্ড করার সময় প্রায় 2-3 GB টুলচেইন ডাউনলোড হবে</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: USB Deployment & Play Store Signing */}
      {activeTab === 'deploy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <Smartphone className="w-4 h-4" />
              </div>
              <span>USB Debugging দিয়ে সরাসরি ফোনে রান ও Logcat দেখা</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              মোবাইলে <strong>Developer Options</strong> এবং <strong>USB Debugging</strong> অন করে ইউএসবি ক্যাবল দিয়ে পিসির সাথে যুক্ত করুন:
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-stone-800">এক ক্লিকে বিল্ড, ইনস্টল ও রিয়েল-টাইম লগ দেখা:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`buildozer android debug deploy run logcat`}</pre>
                  <button
                    onClick={() => copySnippet(`buildozer android debug deploy run logcat`, 5)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 5 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">শুধুমাত্র পাইথনের রিয়েল-টাইম কনসোল লগ ফিল্টার করতে:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`adb logcat -s python`}</pre>
                  <button
                    onClick={() => copySnippet(`adb logcat -s python`, 6)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 6 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
                <FileKey className="w-4 h-4" />
              </div>
              <span>Google Play Store রিলিজ সাইনিং (Signed Release APK)</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              প্রোডাকশন বা প্লে স্টোরে আপলোডের জন্য Release Keystore তৈরি ও সাইন করার নির্দেশিকা:
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-stone-800">১. সিকিউর কীস্টোর জেনারেট করুন:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`keytool -genkey -v -keystore camscanner.keystore \\
  -alias camscanner -keyalg RSA -keysize 2048 -validity 10000`}</pre>
                  <button
                    onClick={() => copySnippet(`keytool -genkey -v -keystore camscanner.keystore -alias camscanner -keyalg RSA -keysize 2048 -validity 10000`, 7)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 7 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-800">২. রিলিজ APK বিল্ড করুন:</span>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg mt-1 font-mono text-[11px] relative group">
                  <pre>{`buildozer -v android release`}</pre>
                  <button
                    onClick={() => copySnippet(`buildozer -v android release`, 8)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
                  >
                    {copiedIndex === 8 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Troubleshooting */}
      {activeTab === 'troubleshoot' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>সচরাচর হওয়া এরর এবং সমাধান (Buildozer FAQ)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">১. Cython compile error</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Kivy 2.3 সাধারণত Cython 3 এর সাথে কম্প্যাটিবিলিটি ইস্যু করে। সমাধান: সবসময় <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">pip install cython==0.29.36</code> ব্যবহার করুন।
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">২. Android NDK r25b Compatibility</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                বিল্ডোজার স্পেকে <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">android.ndk = 25b</code> সেট করা রয়েছে যা Android API 34 ও KivyMD এর সাথে ১০০% কম্প্যাটিবল।
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">৩. Camera Black Screen in Android 13/14</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Android 13+ এ ক্যামেরা পারমিশন রানটাইমে দিতে হয়। আমাদের <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">main.py</code>-তে <code className="font-mono">request_permissions()</code> হ্যান্ডলার রয়েছে যা অ্যাপ অন করার সাথে সাথে ব্যবহারকারীকে পারমিশন ডায়ালগ প্রদর্শন করে।
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-1.5">
              <span className="font-bold text-stone-800">৪. Out of Memory on WSL2</span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                WSL2 এ মেমোরি কম হলে আপনার উইন্ডোজের <code className="font-mono bg-stone-200 px-1 rounded text-stone-800">%USERPROFILE%/.wslconfig</code> ফাইলে <code className="font-mono">memory=8GB</code> এবং <code className="font-mono">swap=8GB</code> বরাদ্দ করে নিন।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

