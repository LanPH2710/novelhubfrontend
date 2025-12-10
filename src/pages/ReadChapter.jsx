import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapterAPI, storyAPI, progressAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import RichTextRenderer from '@/components/RichTextRenderer';

export default function ReadChapter() {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [loading, setLoading] = useState(true);
  const [chaptersList, setChaptersList] = useState([]);
  const [showChoose, setShowChoose] = useState(false);
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFloatingPanel, setShowFloatingPanel] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // calculate prev/next chapter numbers based on current chapter number
  const currentChapNum = parseInt(chapterNumber);
  const prevChapNum = currentChapNum > 1 ? currentChapNum - 1 : null;
  const nextChapNum = chaptersList.length > 0 && currentChapNum < Math.max(...chaptersList.map(c => c.chapterNumber)) ? currentChapNum + 1 : null;

  // Vietnamese-friendly fonts
  const fonts = {
    serif: { name: 'Serif (Noto Serif)', value: "'Noto Serif', Georgia, serif" },
    sansSerif: { name: 'Sans Serif (Inter)', value: "'Inter', 'Segoe UI', sans-serif" },
    monospace: { name: 'Monospace', value: "'Courier New', monospace" },
    garamond: { name: 'Garamond', value: "'Garamond', serif" },
    palatino: { name: 'Palatino', value: "'Palatino', serif" },
    georgia: { name: 'Georgia', value: "'Georgia', serif" },
  };

  useEffect(() => {
    fetchChapterAndStory();
  }, [storyId, chapterNumber]);

  const fetchChapterAndStory = async () => {
    try {
      setLoading(true);
      const [chapterRes, storyRes] = await Promise.all([
        chapterAPI.getChapterByNumber(storyId, chapterNumber),
        storyAPI.getStoryById(storyId)
      ]);
      const chapterData = chapterRes.data.chapter || chapterRes.data;
      setChapter(chapterData);
      setStory(storyRes.data);
      // fetch full chapters list for chooser (large limit)
      try {
        const listRes = await chapterAPI.getChaptersByStory(storyId, 1, 10000);
        setChaptersList(listRes.data.chapters || []);
      } catch (e) {
        console.warn('Failed to fetch chapters list', e);
      }
      // update reading progress for logged-in users
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await progressAPI.updateProgress({ storyId, chapterNumber: chapterData.chapterNumber });
        } catch (e) {
          // non-fatal
          console.warn('Failed to update progress', e);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  // show bottom buttons when user reaches near bottom + show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
      setShowBottomButtons(scrolledToBottom);
      
      // Show scroll-to-top button and floating panel when scrolled down 300px
      const scrolledDown = window.scrollY > 300;
      setShowScrollTop(scrolledDown);
      
      // Debounce isScrolled state to prevent flickering
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(scrolledDown);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    // run once
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (loading || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Controls - Only visible at top */}
        {!isScrolled && (
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            {/* Left: Size */}
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <label className="font-semibold whitespace-nowrap">Size:</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-24 sm:w-32"
              />
              <span className="text-xs sm:text-sm">{fontSize}px</span>
            </div>

            {/* Middle-Left: Font */}
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <label className="font-semibold whitespace-nowrap">Font:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:border-primary"
              >
                {Object.entries(fonts).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => prevChapNum && navigate(`/read/${storyId}/${prevChapNum}`)}
                disabled={!prevChapNum}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base ${prevChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                ← Prev
              </button>

              <button
                onClick={() => setShowChoose(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base"
              >
                Choose
              </button>

              <button
                onClick={() => nextChapNum && navigate(`/read/${storyId}/${nextChapNum}`)}
                disabled={!nextChapNum}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base ${nextChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Next →
              </button>

              <button
                onClick={() => navigate(`/story/${storyId}`)}
                className="bg-primary hover:bg-indigo-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Floating Control Panel - appears when scrolled */}
        {isScrolled && (
          <div className="fixed top-20 right-6 z-50">
            {/* Floating Icon Button */}
            <button
              onClick={() => setShowFloatingPanel(!showFloatingPanel)}
              className="bg-primary hover:bg-indigo-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300"
              title="Show controls"
              aria-label="Show/hide controls"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-4 0V3a2 2 0 014 0v-1.5m0 0a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75V2.25a.75.75 0 00-.75-.75H9.75z" />
              </svg>
            </button>

            {/* Floating Panel Popup */}
            {showFloatingPanel && (
              <div className="absolute top-16 right-0 bg-white rounded-lg shadow-2xl p-4 sm:p-6 w-80 sm:w-96 z-50 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm sm:text-base">Chapter Controls</h3>
                  <button
                    onClick={() => setShowFloatingPanel(false)}
                    className="text-gray-600 hover:text-gray-800 text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Size Control */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <label className="font-semibold whitespace-nowrap w-12">Size:</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs w-12 text-right">{fontSize}px</span>
                  </div>

                  {/* Font Control */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <label className="font-semibold whitespace-nowrap w-12">Font:</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
                    >
                      {Object.entries(fonts).map(([key, { name }]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-2 border-t flex flex-wrap gap-2">
                    <button
                      onClick={() => prevChapNum && navigate(`/read/${storyId}/${prevChapNum}`)}
                      disabled={!prevChapNum}
                      className={`flex-1 px-2 py-1 rounded text-xs ${prevChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      ← Prev
                    </button>

                    <button
                      onClick={() => setShowChoose(true)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Choose
                    </button>

                    <button
                      onClick={() => nextChapNum && navigate(`/read/${storyId}/${nextChapNum}`)}
                      disabled={!nextChapNum}
                      className={`flex-1 px-2 py-1 rounded text-xs ${nextChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Next →
                    </button>

                    <button
                      onClick={() => navigate(`/story/${storyId}`)}
                      className="flex-1 bg-primary hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chapter Content */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{chapter.title}</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {story?.title} • Chapter {chapter.chapterNumber}
          </p>

          {/* top nav buttons */}
          <div className="flex gap-2 sm:gap-3 items-center mb-4 flex-wrap">
            <button
              onClick={() => prevChapNum && navigate(`/read/${storyId}/${prevChapNum}`)}
              disabled={!prevChapNum}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base ${prevChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              ← Prev
            </button>

            <button
              onClick={() => setShowChoose(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base"
            >
              Choose
            </button>

            <button
              onClick={() => nextChapNum && navigate(`/read/${storyId}/${nextChapNum}`)}
              disabled={!nextChapNum}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-base ${nextChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Next →
            </button>
          </div>

          <div
            ref={contentRef}
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: fonts[fontFamily].value,
              lineHeight: '1.8'
            }}
          >
            <RichTextRenderer content={chapter.content} />
          </div>
        </div>

        {/* Navigation Footer (shows prev/choose/next when scrolled to bottom) */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mt-4 sm:mt-6 flex justify-center">
          {showBottomButtons ? (
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              <button
                onClick={() => prevChapNum && navigate(`/read/${storyId}/${prevChapNum}`)}
                disabled={!prevChapNum}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base ${prevChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                ← Prev
              </button>

              <button
                onClick={() => setShowChoose(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base"
              >
                Choose
              </button>

              <button
                onClick={() => nextChapNum && navigate(`/read/${storyId}/${nextChapNum}`)}
                disabled={!nextChapNum}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-base ${nextChapNum ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Next →
              </button>
            </div>
          ) : (
            <div className="w-full text-center text-gray-500 text-xs sm:text-base">Scroll to the end to show navigation</div>
          )}
        </div>

        {/* Choose chapter modal */}
        {showChoose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl p-4 sm:p-6 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chapters</h3>
                <button onClick={() => setShowChoose(false)} className="text-gray-600 text-2xl">×</button>
              </div>
              <div className="space-y-2">
                {chaptersList.map((c) => (
                  <div key={c._id} className="flex items-center justify-between p-2 sm:p-3 border rounded">
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold">Ch {c.chapterNumber}: {c.title}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowChoose(false); navigate(`/read/${storyId}/${c.chapterNumber}`); }}
                        className="bg-primary hover:bg-indigo-700 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Read
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-primary hover:bg-indigo-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 z-40"
            title="Back to top"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
