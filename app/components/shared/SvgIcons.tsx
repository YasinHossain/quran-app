// app/components/SvgIcons.tsx
export const FaPlay = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
  </svg>
);
export const FaPause = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
  </svg>
);
export const FaBookmark = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 384 512" fill="currentColor">
    <path d="M0 512V48C0 21.5 21.5 0 48 0h288c26.5 0 48 21.5 48 48v464L192 400 0 512z" />
  </svg>
);
export const FaBookReader = ({ size = 18, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
export const FaTranslation = ({ size = 20, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);
export const FaBars = ({ size = 20, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M16 132h416v56H16zm0 96h416v56H16zm0 96h416v56H16z" />
  </svg>
);
export const FaFontSetting = ({ size = 20, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);
export const FaChevronDown = ({ size = 16, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
export const FaEllipsisH = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z" />
  </svg>
);
export const FaSearch = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
  </svg>
);
export const FaArrowLeft = ({ size = 20, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z" />
  </svg>
);
export const FaTimes = ({ size = 20, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 352 512" fill="currentColor">
    <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.3 0-44.6l-22.6-22.6c-12.3-12.3-32.3-12.3-44.6 0L176 188.7 75.9 88.6c-12.3-12.3-32.3-12.3-44.6 0L8.7 111.2c-12.3 12.3-12.3 32.3 0 44.6L108.9 256 8.7 356.1c-12.3 12.3-12.3 32.3 0 44.6l22.6 22.6c12.3 12.3 32.3 12.3 44.6 0L176 323.3l100.1 100.1c12.3 12.3 32.3 12.3 44.6 0l22.6-22.6c12.3-12.3 12.3-32.3 0-44.6L242.7 256z" />
  </svg>
);
export const FaHome = ({ size = 22, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 576 512" fill="currentColor">
    <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.94-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300.11L295.63 148.26a12.19 12.19 0 0 0-15.26 0zM571.6 251.47L488 182.57V44.05a12 12 0 0 0-12-12h-40a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.4 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l225.12-185.49a12.19 12.19 0 0 1 15.26 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" />
  </svg>
);
export const FaRegBookmark = ({ size = 22, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 384 512" fill="currentColor">
    <path d="M336 0H48C21.5 0 0 21.5 0 48v464l192-112 192 112V48c0-26.5-21.5-48-48-48zm0 428.4L192 342.8 48 428.4V48h288v380.4z" />
  </svg>
);
export const FaTh = ({ size = 22, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M448 32H64C46.33 32 32 46.33 32 64v384c0 17.67 14.33 32 32 32h384c17.67 32 32-14.33 32-32V64c0-17.67-14.33-32-32-32zM224 160H96V96h128v64zm192 128H288v-64h128v64zm-192 0H96v-64h128v64zm192 0h-64v64h64v-64zm-192 128H96v-64h128v64zm192 0H288v-64h128v64z" />
  </svg>
);

// Added FaCheck icon
export const FaCheck = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M173.898 439.404L166.39 432l-24.5-24.5-137.13-137.13L.74 242.5l11.314 11.314L134.5 374.3l24.5 24.5 24.5 24.5 137.13-137.13L349.5 270.5l-11.314-11.314L173.898 439.404zM504.26 105.4l-11.314 11.314L370.5 239.3l-24.5 24.5-24.5-24.5-137.13-137.13L171.898 81.4l11.314-11.314L247.5 126.3l24.5-24.5 137.13-137.13L479.26 78.5l11.314 11.314L389.5 199.3l11.314 11.314z" />
  </svg>
);

// Icons from HomePage
export const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const Moon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const FaShare = ({ size = 18, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
