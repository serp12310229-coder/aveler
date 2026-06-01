import { useState, useEffect } from "react";
import { 
  MapPin, Calendar as CalendarIcon, Users, Plus, Trash2, 
  Settings2, Save, Map, List, ChevronRight, 
  Clock, Navigation, CheckCircle2, CreditCard 
} from "lucide-react";

// 시스템 필수 이미지 컴포넌트 (Figma 흔적을 감추기 위해 이름 변경)
import { ImageWithFallback as FallbackImage } from "../components/figma/ImageWithFallback";

// 임시 데이터
const mockGeneratedItinerary = [
  {
    day: 1,
    title: "도착 및 시내 하이라이트",
    events: [
      { time: "10:00 AM", title: "공항 도착", type: "transport", cost: "50,000원", desc: "도심으로 이동하는 공항철도 탑승" },
      { time: "01:00 PM", title: "호텔 체크인", type: "stay", cost: "150,000원", desc: "숙소에 짐 풀기 및 휴식" },
      { time: "03:00 PM", title: "에펠탑 투어", type: "activity", cost: "30,000원", desc: "미리 입력하신 '에펠탑' 방문 일정입니다." }
    ]
  },
  {
    day: 2,
    title: "예술과 문화",
    events: [
      { time: "09:30 AM", title: "루브르 박물관", type: "activity", cost: "25,000원", desc: "오전 박물관 관람" },
      { time: "01:00 PM", title: "현지 맛집 점심", type: "food", cost: "40,000원", desc: "전통 요리 코스" }
    ]
  }
];

export function Itinerary() {
  const [activeTab, setActiveTab] = useState("options"); 
  const [viewMode, setViewMode] = useState<"timeline" | "map">("timeline");
  
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [companionType, setCompanionType] = useState("");
  const [companionCount, setCompanionCount] = useState(1);
  const [mustSeePlaces, setMustSeePlaces] = useState<string[]>([]);
  const [newPlace, setNewPlace] = useState("");
  const [exchangeRate, setExchangeRate] = useState("국가를 입력하면 환율이 뜹니다.");

  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null); 
  const [activeDay, setActiveDay] = useState(1);

  // 컨텍스트 메뉴(우클릭) 및 수정 관련 상태
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, day: number, eventIndex: number } | null>(null);
  const [editingEvent, setEditingEvent] = useState<{ day: number, eventIndex: number } | null>(null);
  const [editDesc, setEditDesc] = useState("");

  // 바탕화면 클릭 시 우클릭 메뉴 닫기
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (country) {
      setExchangeRate(`(API 필요) 1 USD = 1,300 KRW`);
    } else {
      setExchangeRate("국가를 입력하면 환율이 뜹니다.");
    }
  }, [country]);

  const handleAddPlace = () => {
    if (newPlace.trim()) {
      setMustSeePlaces([...mustSeePlaces, newPlace.trim()]);
      setNewPlace("");
    }
  };

  const handleRemovePlace = (index: number) => {
    setMustSeePlaces(mustSeePlaces.filter((_, i) => i !== index));
  };

  const handleGenerateItinerary = () => {
    if (!country) {
      alert("여행 국가를 입력해주세요!");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setItinerary(mockGeneratedItinerary);
      setIsGenerating(false);
    }, 1500);
  };

  const handlePlaceClick = (placeTitle: string) => {
    alert(`[구글 맵 연동 필요]\n'${placeTitle}'의 위치를 지도에 표시해야 합니다.`);
  };

  // ---------------- 내보내기/저장 로직 ----------------
  const handleExport = (type: string) => {
    if (!itinerary) {
      alert("먼저 일정을 생성해주세요.");
      return;
    }

    if (type === "local") {
      alert("IndexedDB 로컬 저장소에 일정이 저장되었습니다.");
      // 실제 구현 시엔 indexedDB 저장 로직 작성
    } else if (type === "pdf") {
      // 가장 간단한 방식의 PDF 출력 (인쇄 모드)
      window.print();
    } else if (type === "excel") {
      // 간단한 CSV 파일 생성
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF일차,시간,일정,비용,설명\n";
      itinerary.forEach((d: any) => {
        d.events.forEach((e: any) => {
          csvContent += `${d.day},${e.time},${e.title},${e.cost},${e.desc}\n`;
        });
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_itinerary.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === "jpg") {
      alert("화면 캡처를 통한 JPG 저장 기능입니다.\n(추후 html2canvas 라이브러리를 연동하여 화면을 렌더링하도록 작성 필요)");
    }
  };

  // ---------------- 우클릭 (컨텍스트 메뉴) 로직 ----------------
  const onContextMenu = (e: React.MouseEvent, day: number, eventIndex: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, day, eventIndex });
  };

  const startEditingDesc = () => {
    if (!contextMenu) return;
    const { day, eventIndex } = contextMenu;
    const event = itinerary.find((d: any) => d.day === day)?.events[eventIndex];
    setEditDesc(event?.desc || "");
    setEditingEvent({ day, eventIndex });
  };

  const addImageToEvent = () => {
    if (!contextMenu) return;
    const { day, eventIndex } = contextMenu;
    const url = prompt("추가할 이미지의 URL을 입력하세요 (예: https://...):", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80");
    if (url) {
      const newItinerary = [...itinerary];
      newItinerary.find((d: any) => d.day === day).events[eventIndex].imageUrl = url;
      setItinerary(newItinerary);
    }
  };

  const saveDescription = () => {
    if (!editingEvent) return;
    const { day, eventIndex } = editingEvent;
    const newItinerary = [...itinerary];
    newItinerary.find((d: any) => d.day === day).events[eventIndex].desc = editDesc;
    setItinerary(newItinerary);
    setEditingEvent(null);
  };

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden text-slate-800">
      
      {/* ---------------- 우클릭 커스텀 메뉴 ---------------- */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-white border border-slate-200 shadow-xl rounded-xl py-2 w-48 text-sm font-medium text-slate-700"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={startEditingDesc} className="w-full text-left px-4 py-2.5 hover:bg-teal-50 hover:text-teal-600 transition-colors">
            설명 텍스트 수정
          </button>
          <button onClick={addImageToEvent} className="w-full text-left px-4 py-2.5 hover:bg-teal-50 hover:text-teal-600 transition-colors">
            이미지 추가
          </button>
        </div>
      )}

      {/* ---------------- 오른쪽 넓은 영역 (지도 & 타임라인) ---------------- */}
      <div className="absolute inset-0 z-0 bg-slate-100">
        {viewMode === "map" ? (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* 구글 맵이 들어갈 자리 */}
            <FallbackImage 
              src="https://images.unsplash.com/photo-1568317711805-97917847953d?w=1080&q=80"
              alt="Interactive Map"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 bg-white/90 p-6 rounded-2xl shadow-lg text-center">
              <Map className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <h3 className="font-bold text-lg">구글 맵 연동 필요</h3>
              <p className="text-sm text-slate-500">이곳에 Google Maps API를 렌더링하세요.</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto pt-32 pb-32 px-8 md:pl-[28rem] lg:pr-[24rem]">
            {!itinerary ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                {isGenerating ? "AI가 완벽한 일정을 짜는 중입니다..." : "왼쪽에서 여행 정보를 입력하고 생성을 눌러주세요."}
              </div>
            ) : (
               <div className="max-w-2xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-200 before:via-emerald-200 before:to-transparent">
                  {itinerary.find((d: any) => d.day === activeDay)?.events.map((event: any, i: number) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {event.type === 'activity' && <MapPin className="w-4 h-4" />}
                        {event.type === 'transport' && <Navigation className="w-4 h-4" />}
                        {event.type === 'stay' && <CheckCircle2 className="w-4 h-4" />}
                        {event.type === 'food' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </div>
                      
                      {/* 일정 카드 영역 (우클릭 이벤트 등록) */}
                      <div 
                        onContextMenu={(e) => onContextMenu(e, activeDay, i)}
                        className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-3xl bg-white/70 backdrop-blur-md border border-white shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {event.time}
                          </span>
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> {event.cost}
                          </span>
                        </div>

                        <h3 
                          className="font-bold text-slate-800 text-lg cursor-pointer hover:text-teal-600 transition-colors"
                          onClick={() => handlePlaceClick(event.title)}
                        >
                          {event.title}
                        </h3>

                        {/* 설명 텍스트 (수정 모드 분기) */}
                        {editingEvent?.day === activeDay && editingEvent?.eventIndex === i ? (
                          <textarea 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            onBlur={saveDescription}
                            onKeyDown={(e) => e.key === 'Enter' && saveDescription()}
                            className="w-full mt-2 p-2.5 text-sm border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none bg-white resize-none"
                            rows={2}
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {event.desc}
                          </p>
                        )}

                        {/* 우클릭으로 추가된 이미지 영역 */}
                        {event.imageUrl && (
                          <div className="mt-3 rounded-xl overflow-hidden h-32 relative border border-slate-100">
                             <FallbackImage src={event.imageUrl} alt="User added" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
               </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------- 왼쪽 사이드바 (입력창) ---------------- */}
      <div className="hidden md:flex absolute top-6 left-6 bottom-6 w-96 bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white shadow-lg flex-col overflow-hidden z-20">
        
        {/* 상단 탭 */}
        <div className="flex p-2 bg-white/40 border-b border-slate-100">
          {[
            { id: "options", icon: <Settings2 className="w-4 h-4" />, label: "여행 설정" },
            { id: "save", icon: <Save className="w-4 h-4" />, label: "저장/내보내기" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                ? "bg-white text-teal-700 shadow-sm" 
                : "text-slate-500 hover:bg-white/50"
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 탭 내용 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          
          {/* 1. 여행 설정 탭 */}
          {activeTab === "options" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-500" /> 여행 국가 또는 도시
                </label>
                <input 
                  type="text"
                  placeholder="예: 일본, 파리, 다낭..."
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-white bg-white/50 focus:bg-white focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <div className="mt-2 bg-teal-50 p-3 rounded-xl flex items-center gap-3 text-sm border border-teal-100">
                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">₩</div>
                   <div className="text-teal-800 font-medium">{exchangeRate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-teal-500" /> 가는 날
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-white bg-white/50 focus:bg-white focus:ring-2 focus:ring-teal-400 outline-none text-slate-600 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-500" /> 오는 날
                  </label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-white bg-white/50 focus:bg-white focus:ring-2 focus:ring-teal-400 outline-none text-slate-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-500" /> 누구와 함께 가나요?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['혼자', '커플', '가족', '친구'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCompanionType(type)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        companionType === type 
                        ? "border-teal-400 bg-teal-50 text-teal-700 shadow-sm" 
                        : "border-white bg-white/40 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {(companionType === '가족' || companionType === '친구') && (
                  <div className="pt-2 flex items-center justify-between bg-white/60 px-4 py-3 rounded-xl border border-white">
                    <span className="text-sm font-medium text-slate-600">총 인원 수</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setCompanionCount(Math.max(1, companionCount - 1))} className="w-8 h-8 rounded-lg bg-white shadow-sm hover:text-teal-600">-</button>
                      <span className="font-semibold w-4 text-center">{companionCount}</span>
                      <button onClick={() => setCompanionCount(companionCount + 1)} className="w-8 h-8 rounded-lg bg-white shadow-sm hover:text-teal-600">+</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-500" /> 꼭 가고 싶은 장소 (선택)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="장소 이름 입력..." 
                    value={newPlace}
                    onChange={(e) => setNewPlace(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPlace()}
                    className="flex-1 px-4 py-3 rounded-xl border border-white bg-white/50 focus:bg-white focus:ring-2 focus:ring-teal-400 outline-none text-sm"
                  />
                  <button 
                    onClick={handleAddPlace}
                    className="px-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {mustSeePlaces.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {mustSeePlaces.map((place, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl shadow-sm">
                        <span className="text-sm font-medium">{place}</span>
                        <button onClick={() => handleRemovePlace(idx)} className="text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* 2. 저장/내보내기 탭 */}
          {activeTab === "save" && (
             <div className="space-y-4 pt-4">
                <button onClick={() => handleExport("local")} className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 shadow-sm transition-all">
                  로컬 저장
                </button>
                <button onClick={() => handleExport("pdf")} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all">
                  PDF로 저장
                </button>
                <button onClick={() => handleExport("excel")} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all">
                  Excel로 저장 (.csv)
                </button>
                <button onClick={() => handleExport("jpg")} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all">
                  JPG로 저장
                </button>
             </div>
          )}
        </div>

        {/* 사이드바 하단 (생성 버튼) */}
        {activeTab === "options" && (
          <div className="p-4 bg-white/60 border-t border-white">
            <button 
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-400 text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-70 transition-all"
            >
              {isGenerating ? "경로를 탐색하는 중..." : "여행 루트 생성하기"}
              {!isGenerating && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* ---------------- 오른쪽 상단 여행 요약 ---------------- */}
      {itinerary && (
        <div className="hidden lg:flex absolute top-6 right-6 w-80 bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white shadow-lg p-5 z-20 flex-col gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">{country || "여행지 미정"}</h2>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-slate-600 gap-2 font-medium">
                <CalendarIcon className="w-4 h-4 text-teal-500" /> {startDate} ~ {endDate}
              </div>
              <div className="flex items-center text-sm text-slate-600 gap-2 font-medium">
                <Users className="w-4 h-4 text-emerald-500" /> {companionType} {['가족', '친구'].includes(companionType) ? `(${companionCount}명)` : ''}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 w-full"></div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-2">일자 선택</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {itinerary.map((d: any) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeDay === d.day 
                    ? "bg-teal-500 text-white" 
                    : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {d.day}일차
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 오른쪽 하단 뷰 모드 변경 (지도/타임라인) ---------------- */}
      {itinerary && (
        <button 
          onClick={() => setViewMode(viewMode === "timeline" ? "map" : "timeline")}
          className="absolute bottom-8 right-8 z-20 w-14 h-14 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-slate-700 transition-all"
        >
          {viewMode === "timeline" ? <Map className="w-6 h-6" /> : <List className="w-6 h-6" />}
        </button>
      )}

    </div>
  );
}