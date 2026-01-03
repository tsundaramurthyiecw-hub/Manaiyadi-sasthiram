
import React, { useState, useMemo } from 'react';
import { 
  Home, 
  MapPin, 
  User, 
  Ruler, 
  Droplets, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  Layout,
  Download,
  ShieldCheck,
  Zap,
  Waves,
  DoorOpen,
  BookOpen,
  Car,
  Bath,
  Printer
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Direction, LandInfo, OwnerInfo, RoomRequirements } from './types';
import { DIRECTIONS, RASI_LIST, STAR_LIST } from './constants';
import { calculateAyadi } from './services/sasthiramService';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiBlueprint, setAiBlueprint] = useState<string | null>(null);

  const [land, setLand] = useState<LandInfo>({
    length: 30,
    width: 40,
    totalSqFt: 1200,
    totalKuzhi: 133.33,
    facing: Direction.EAST,
    roadDirection: Direction.EAST
  });

  const [owner, setOwner] = useState<OwnerInfo>({
    name: '',
    age: '',
    dob: '',
    tob: '',
    star: STAR_LIST[0],
    rasi: RASI_LIST[0]
  });

  const [rooms, setRooms] = useState<RoomRequirements>({
    bedroomCount: 2,
    bedroomSize: '10x12',
    bedroomHasAttachedBath: true,
    kitchenSize: '8x10',
    poojaSize: '6x6',
    readingRoomSize: '10x8',
    porticoSize: '12x10',
    toiletSize: '5x7',
    floors: 1,
    borewellDirection: Direction.NORTH_EAST,
    overheadTankDirection: Direction.SOUTH_WEST,
    mainEntrance: Direction.EAST
  });

  // Derived calculations
  const ayadi = useMemo(() => calculateAyadi(land), [land]);
  const isVaravuGreater = ayadi.varavu > ayadi.selavu;
  const isAayulAuspicious = ayadi.aayul >= 50;

  const resultStatus = useMemo(() => {
    if (isVaravuGreater && isAayulAuspicious) return 'Auspicious';
    if (isVaravuGreater || isAayulAuspicious) return 'Average';
    return 'Inauspicious';
  }, [isVaravuGreater, isAayulAuspicious]);

  // Handlers
  const handleLandChange = (field: keyof LandInfo, value: any) => {
    const newLand = { ...land, [field]: value };
    if (field === 'length' || field === 'width') {
      const area = Number(newLand.length) * Number(newLand.width);
      newLand.totalSqFt = area;
      newLand.totalKuzhi = Number((area / 9).toFixed(2));
    }
    setLand(newLand);
  };

  const generateAIBlueprint = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        Act as a Vastu and Manai Adi Sasthiram Architectural Expert. Generate a detailed house blueprint analysis and a structured ASCII-based floor plan.
        
        INPUT DATA:
        Plot Size: ${land.length} ft x ${land.width} ft
        Plot Facing Direction: ${land.facing}
        Owner Name: ${owner.name}, Star: ${owner.star}, Rasi: ${owner.rasi}
        
        ROOM REQUIREMENTS:
        - Number of Bedrooms: ${rooms.bedroomCount} (${rooms.bedroomSize}) ${rooms.bedroomHasAttachedBath ? 'with attached bathroom' : 'without attached bathroom'}
        - Reading Room size: ${rooms.readingRoomSize}
        - Kitchen size: ${rooms.kitchenSize}
        - Pooja Room size: ${rooms.poojaSize}
        - Portico size: ${rooms.porticoSize}
        - Toilet size: ${rooms.toiletSize}
        - Number of Floors: ${rooms.floors}
        
        CONSTRUCTION DIRECTIONS:
        - Borewell Direction: ${rooms.borewellDirection}
        - Overhead Water Tank Direction: ${rooms.overheadTankDirection}
        - Main Entrance Direction: ${rooms.mainEntrance}
        
        AYADI 16 PARAMETERS CALCULATED:
        - Karpam: ${ayadi.karpam}
        - Varavu: ${ayadi.varavu}
        - Selavu: ${ayadi.selavu}
        - Aayul: ${ayadi.aayul}
        - Nakshatra: ${ayadi.natchathiram}
        - Yoni: ${ayadi.yoni}
        
        OUTPUT FORMAT:
        1. "HOUSE BLUEPRINT SCHEMATIC": A detailed top-down view using text characters (| - +) showing the exact placement of rooms. Label the North direction.
        2. "ROOM PLACEMENT ANALYSIS": Detailed Vastu logic for why each room is in its specific corner (e.g. Master Bedroom in South-West, Kitchen in South-East).
        3. "SASTHIRAM REPORT": A spiritual summary in both English and Tamil concluding if this construction is Auspicious (சுபமானது) or Inauspicious (அசுபமானது).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
      });

      setAiBlueprint(response.text);
      setStep(4);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = (isGood: boolean, goodLabel: string, badLabel: string) => {
    return isGood ? (
      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
        <CheckCircle2 className="w-3 h-3" /> {goodLabel}
      </span>
    ) : (
      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
        <XCircle className="w-3 h-3" /> {badLabel}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-['Inter']">
      {/* Header */}
      <header className="bg-indigo-950 text-white p-6 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-xl shadow-amber-500/20 rotate-3 group-hover:rotate-0 transition-transform">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none">Manai Adi Expert</h1>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sacred Architectural Intelligence</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
             <div className="text-right border-r border-white/20 pr-6">
               <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Calculations</p>
               <p className="text-xs font-bold text-white">Ayadi 16 Parameters</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Engine</p>
               <p className="text-xs font-bold text-white">Gemini 3 AI Blueprint</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4">
        {/* Step Progress */}
        <div className="mb-12 flex justify-between px-6 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full overflow-hidden">
             <div 
              className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
             ></div>
          </div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border-4 transition-all duration-500 shadow-lg ${
                step === s ? 'bg-amber-500 border-indigo-900 text-white scale-110 -rotate-3' : 
                step > s ? 'bg-green-500 border-green-200 text-white' : 'bg-white border-slate-200 text-slate-300'
              }`}>
                {step > s ? <CheckCircle2 className="w-7 h-7" /> : s}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${step >= s ? 'text-indigo-900' : 'text-slate-400'}`}>
                {['Land', 'Owner', 'Rooms', 'Report'][s-1]}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[600px] transition-all duration-500 ring-1 ring-black/5">
          
          {step === 1 && (
            <div className="p-8 md:p-14 animate-fadeIn">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                    <MapPin className="text-indigo-600 w-8 h-8" /> 1. BASIC LAND & BUILDING INPUT
                  </h2>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">(அடிப்படை நிலம் & கட்டிடம் தகவல்)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="group relative">
                    <label className="block text-sm font-black text-slate-700 mb-3 transition-colors group-focus-within:text-indigo-600 uppercase tracking-tighter">
                      Land Length (feet) / நிலத்தின் நீளம் (அடி)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-xl font-black text-indigo-950 shadow-inner"
                      value={land.length}
                      onChange={(e) => handleLandChange('length', e.target.value)}
                    />
                  </div>
                  <div className="group relative">
                    <label className="block text-sm font-black text-slate-700 mb-3 transition-colors group-focus-within:text-indigo-600 uppercase tracking-tighter">
                      Land Width (feet) / நிலத்தின் அகலம் (அடி)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-xl font-black text-indigo-950 shadow-inner"
                      value={land.width}
                      onChange={(e) => handleLandChange('width', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-500/5">
                      <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest leading-none">Total Square Feet</p>
                      <p className="text-[8px] text-indigo-400 font-bold uppercase mt-1">(மொத்த சதுரஅடி)</p>
                      <p className="text-3xl font-black text-indigo-900 leading-none mt-3 tracking-tighter">{land.totalSqFt}</p>
                    </div>
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 shadow-xl shadow-amber-500/5">
                      <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-none">Total Kuzhi</p>
                      <p className="text-[8px] text-amber-400 font-bold uppercase mt-1">(மொத்த குழி)</p>
                      <p className="text-3xl font-black text-amber-900 leading-none mt-3 tracking-tighter">{land.totalKuzhi}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter">Plot Facing Direction / மனை முகப்புத் திசை</label>
                    <select 
                      className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all appearance-none font-black text-indigo-900 shadow-sm"
                      value={land.facing}
                      onChange={(e) => handleLandChange('facing', e.target.value)}
                    >
                      {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter">Road Direction / ரோடு அமைந்த திசை</label>
                    <select 
                      className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all appearance-none font-black text-indigo-900 shadow-sm"
                      value={land.roadDirection}
                      onChange={(e) => handleLandChange('roadDirection', e.target.value)}
                    >
                      {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="p-6 bg-indigo-900 text-indigo-100 rounded-2xl flex items-start gap-4 shadow-2xl">
                    <Zap className="w-10 h-10 text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Auspicious Tip</p>
                      <p className="text-xs font-medium leading-relaxed mt-1 opacity-90">In Manai Adi, the 'Kuzhi' vibration determines the soul of the home. Odd numbers like 1, 3, 5, 7, 9 are generally preferred for residential units.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 md:p-14 animate-fadeIn">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                  <User className="text-indigo-600 w-8 h-8" /> 2. OWNER DETAILS
                </h2>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">(உரிமையாளர் விவரங்கள்)</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter">Owner Name / உரிமையாளர் பெயர்</label>
                    <input 
                      type="text" 
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-indigo-950"
                      placeholder="e.g. S. Arumugam"
                      value={owner.name}
                      onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter">Age / வயது</label>
                      <input 
                        type="number" 
                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black"
                        value={owner.age}
                        onChange={(e) => setOwner({ ...owner, age: e.target.value })}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter">Date of Birth / பிறந்த தேதி</label>
                      <input 
                        type="date" 
                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black"
                        value={owner.dob}
                        onChange={(e) => setOwner({ ...owner, dob: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter leading-none">Birth Star / பிறந்த நட்சத்திரம்</label>
                      <select 
                        className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 appearance-none outline-none transition-all font-black text-indigo-900"
                        value={owner.star}
                        onChange={(e) => setOwner({ ...owner, star: e.target.value })}
                      >
                        {STAR_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter leading-none">Rasi / ராசி</label>
                      <select 
                        className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 appearance-none outline-none transition-all font-black text-indigo-900"
                        value={owner.rasi}
                        onChange={(e) => setOwner({ ...owner, rasi: e.target.value })}
                      >
                        {RASI_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter">Birth Time / பிறந்த நேரம்</label>
                    <input 
                      type="time" 
                      className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-indigo-950"
                      value={owner.tob}
                      onChange={(e) => setOwner({ ...owner, tob: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 md:p-14 animate-fadeIn">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                  <Layout className="text-indigo-600 w-8 h-8" /> 3. ROOM DETAILS PROMPT
                </h2>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">(அறை விவரங்கள்)</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter leading-none">Number of Bedrooms</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        value={rooms.bedroomCount}
                        onChange={(e) => setRooms({ ...rooms, bedroomCount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter leading-none">Bedroom L & W</label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        placeholder="e.g. 12x14"
                        value={rooms.bedroomSize}
                        onChange={(e) => setRooms({ ...rooms, bedroomSize: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-indigo-900 text-white rounded-2xl border-2 border-white/10 shadow-xl transition-transform hover:scale-[1.02] cursor-pointer" onClick={() => setRooms({...rooms, bedroomHasAttachedBath: !rooms.bedroomHasAttachedBath})}>
                    <div className={`p-2 rounded-lg ${rooms.bedroomHasAttachedBath ? 'bg-amber-500' : 'bg-white/20'}`}>
                      <Bath className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase tracking-tighter">Attached Bathroom?</p>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase">(இணைக்கப்பட்ட குளியலறை)</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-4 ${rooms.bedroomHasAttachedBath ? 'bg-amber-500 border-white' : 'border-white/20'}`}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> Reading Room L & W
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        placeholder="e.g. 10x8"
                        value={rooms.readingRoomSize}
                        onChange={(e) => setRooms({ ...rooms, readingRoomSize: e.target.value })}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter flex items-center gap-2 leading-none">
                        <FileText className="w-4 h-4 text-amber-600" /> Pooja Room L & W
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        placeholder="e.g. 6x6"
                        value={rooms.poojaSize}
                        onChange={(e) => setRooms({ ...rooms, poojaSize: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter flex items-center gap-2">
                       <DoorOpen className="w-5 h-5 text-indigo-600" /> Main Entrance Direction
                    </label>
                    <select 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 appearance-none outline-none font-black text-lg text-indigo-950 shadow-sm"
                      value={rooms.mainEntrance}
                      onChange={(e) => setRooms({ ...rooms, mainEntrance: e.target.value as Direction })}
                    >
                      {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] shadow-inner border border-slate-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter flex items-center gap-2">
                        <Car className="w-5 h-5 text-slate-600" /> Portico L & W
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        placeholder="e.g. 12x10"
                        value={rooms.porticoSize}
                        onChange={(e) => setRooms({ ...rooms, porticoSize: e.target.value })}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter flex items-center gap-2 leading-none">
                        <Bath className="w-5 h-5 text-blue-600" /> Toilet L & W
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        placeholder="e.g. 5x8"
                        value={rooms.toiletSize}
                        onChange={(e) => setRooms({ ...rooms, toiletSize: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter leading-none">Kitchen L & W</label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        placeholder="e.g. 10x10"
                        value={rooms.kitchenSize}
                        onChange={(e) => setRooms({ ...rooms, kitchenSize: e.target.value })}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tighter leading-none">Number of Floors</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-black text-lg"
                        value={rooms.floors}
                        onChange={(e) => setRooms({ ...rooms, floors: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                         <Waves className="w-4 h-4 text-blue-600" /> Borewell Direction
                      </label>
                      <select 
                        className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 appearance-none outline-none font-bold text-sm"
                        value={rooms.borewellDirection}
                        onChange={(e) => setRooms({ ...rooms, borewellDirection: e.target.value as Direction })}
                      >
                        {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2 leading-none">
                         <Droplets className="w-4 h-4 text-blue-800" /> Overhead Tank Direction
                      </label>
                      <select 
                        className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 appearance-none outline-none font-bold text-sm"
                        value={rooms.overheadTankDirection}
                        onChange={(e) => setRooms({ ...rooms, overheadTankDirection: e.target.value as Direction })}
                      >
                        {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col items-center">
                <button 
                  onClick={generateAIBlueprint}
                  disabled={loading}
                  className="group relative flex items-center gap-6 px-14 py-6 bg-indigo-950 text-white rounded-[2rem] font-black text-2xl shadow-[0_20px_50px_rgba(31,38,135,0.37)] hover:bg-black transition-all disabled:opacity-50 hover:-translate-y-2 active:scale-95 overflow-hidden ring-4 ring-amber-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="animate-pulse">Consulting Shastras...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
                      <span>GENERATE AI BLUEPRINT</span>
                    </>
                  )}
                </button>
                <p className="mt-6 text-slate-400 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> 100% Vastu Compliant Analysis
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fadeIn bg-[#f8f5f0] min-h-screen">
              {/* Report Header - Formal Styled */}
              <div className="p-12 border-b-8 border-double border-amber-200 text-center space-y-4">
                <div className="inline-block p-4 bg-white border-4 border-amber-600 rounded-3xl mb-4 shadow-2xl">
                   <ShieldCheck className="w-16 h-16 text-amber-600" />
                </div>
                <h2 className="text-5xl font-black text-indigo-950 uppercase tracking-tighter leading-none">Manai Adi Sasthiram Report</h2>
                <div className="flex flex-col items-center gap-1">
                   <p className="text-amber-800 font-black text-xl italic leading-tight">Sacred Architectural Verdict</p>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Proprietor: {owner.name || 'Universal Owner'}</p>
                </div>
                <div className="mt-8 flex justify-center gap-4">
                   {renderBadge(resultStatus === 'Auspicious' || resultStatus === 'Average', "Subha (Auspicious)", "Asuba (Inauspicious)")}
                   <div className={`px-5 py-1.5 rounded-full text-xs font-black uppercase shadow-sm ${resultStatus === 'Auspicious' ? 'bg-green-600 text-white' : resultStatus === 'Average' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'}`}>
                      Verdict: {resultStatus}
                   </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto p-8 lg:p-14 grid grid-cols-1 xl:grid-cols-12 gap-12">
                
                {/* 16 Parameters Scroll - Left Column */}
                <div className="xl:col-span-4 relative">
                  <div className="bg-[#fff9f0] p-10 rounded-[3rem] border-4 border-amber-100 shadow-2xl relative overflow-hidden ring-1 ring-amber-900/5">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 rotate-12">
                      <FileText className="w-64 h-64" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8 border-b-2 border-amber-200 pb-4">
                        <Zap className="w-8 h-8 text-amber-600" />
                        <h3 className="text-2xl font-black text-amber-900 uppercase tracking-tighter leading-none">16 Ayadi Parameters</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {Object.entries(ayadi).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-end border-b border-amber-200/50 pb-2 group hover:bg-amber-100/30 transition-colors p-1 rounded-lg">
                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{key}</span>
                            <span className="text-lg font-black text-slate-900 tracking-tight group-hover:scale-110 transition-transform origin-right">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-xl">
                           <div className="flex items-center justify-between mb-4">
                             <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Flow</p>
                               <p className="text-sm font-black text-slate-900">Varavu > Selavu Check</p>
                             </div>
                             {isVaravuGreater ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                           </div>
                           <div className="flex items-center justify-between">
                             <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longevity</p>
                               <p className="text-sm font-black text-slate-900">Aayul: {ayadi.aayul} Years</p>
                             </div>
                             {isAayulAuspicious ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Blueprint & Visual Report - Right Column */}
                <div className="xl:col-span-8 space-y-12">
                  
                  {/* Blueprint Layout Area */}
                  <div className="bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800 overflow-hidden relative group">
                    <div className="bg-slate-800 p-6 flex items-center justify-between border-b-4 border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
                        <h3 className="text-amber-400 font-black text-sm tracking-[0.3em] uppercase leading-none">SACRED HOUSE BLUEPRINT</h3>
                      </div>
                      <div className="flex gap-4">
                         <button 
                          onClick={() => window.print()}
                          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border border-white/10"
                        >
                          <Printer className="w-4 h-4" /> PRINT REPORT
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-10 bg-slate-950 font-mono text-[11px] leading-relaxed text-blue-400 overflow-x-auto min-h-[500px] selection:bg-amber-500 selection:text-white">
                       {aiBlueprint ? (
                         <div className="whitespace-pre scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-10">
                           {aiBlueprint}
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center py-40 text-slate-600">
                           <Sparkles className="w-16 h-16 mb-6 animate-spin-slow opacity-20" />
                           <p className="font-black text-sm uppercase tracking-widest animate-pulse">Etching sacred geometry onto the void...</p>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Vastu Verdict Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 bg-indigo-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group border-t-8 border-indigo-500">
                      <div className="absolute bottom-0 right-0 -mb-10 -mr-10 opacity-10 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-64 h-64" />
                      </div>
                      <h4 className="font-black uppercase tracking-[0.2em] text-xs text-amber-400 mb-6 border-b border-white/10 pb-4">Architectural Verdict</h4>
                      <p className="text-lg leading-snug font-bold italic opacity-95">
                        "The {land.totalKuzhi} Kuzhi vibration of this land aligns {resultStatus === 'Auspicious' ? 'perfectly' : 'moderately'} with {owner.name}'s {owner.star} star. The {land.facing}-facing orientation ensures maximum Pranic energy flow if the main entrance is placed in the suggested auspicious zone."
                      </p>
                    </div>

                    <div className="p-10 bg-amber-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group border-t-8 border-amber-900">
                      <div className="absolute bottom-0 right-0 -mb-10 -mr-10 opacity-20 group-hover:scale-110 transition-transform">
                        <Waves className="w-64 h-64" />
                      </div>
                      <h4 className="font-black uppercase tracking-[0.2em] text-xs text-indigo-900 mb-6 border-b border-black/10 pb-4">Water & Utility Balance</h4>
                      <p className="text-lg leading-snug font-bold italic">
                        "Ensuring the Borewell remains in the North-East (Eshanya) and the Overhead Tank in the South-West (Nairutya) creates the 'Vastu Weight' needed to ground your prosperity. The general toilet placement avoids the core Brahma Sthana."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 flex justify-center pb-12">
                <button 
                  onClick={() => {
                    setStep(1);
                    setAiBlueprint(null);
                  }}
                  className="px-14 py-5 text-indigo-950 font-black uppercase tracking-[0.3em] border-4 border-indigo-950 rounded-3xl hover:bg-indigo-950 hover:text-white transition-all shadow-2xl bg-white hover:-translate-y-2 active:scale-95 flex items-center gap-4"
                >
                  <ArrowLeft className="w-6 h-6" /> ANALYZE NEW PLOT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls Bar */}
        {step < 4 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-50">
            <div className="bg-white/95 backdrop-blur-3xl border-2 border-slate-200 rounded-[2rem] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex justify-between items-center ring-8 ring-indigo-900/5">
              <button 
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-3 px-8 py-4 text-slate-600 font-black uppercase tracking-tighter hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20"
              >
                <ArrowLeft className="w-5 h-5" /> PREVIOUS
              </button>
              {step < 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-3 px-12 py-4 bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-950/20 hover:bg-black transition-all hover:scale-105 active:scale-95 group"
                >
                  NEXT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <div className="px-6 flex items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Decorative Overlays */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-indigo-950 to-amber-500 z-[60]"></div>
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @media print {
          .fixed, header, button { display: none !important; }
          main { margin-top: 0 !important; }
          .bg-slate-900 { background: white !important; color: black !important; border: 1px solid #ccc !important; }
          .text-blue-400 { color: black !important; }
          .rounded-[2.5rem], .rounded-[3rem] { border-radius: 0 !important; }
          .shadow-2xl { shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
