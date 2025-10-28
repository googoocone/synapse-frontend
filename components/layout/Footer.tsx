const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">뉴씽크</h3>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">사업자등록번호:</span> 875-31-01047
            </p>
            <p>
              <span className="font-medium">상호명:</span> 뉴씽크
            </p>
            <p>
              <span className="font-medium">주소:</span> 경기도 화성시 산척동
              745 반도유보라 아이비파크 10.2차 3618동 1202호
            </p>
            <p>
              <span className="font-medium">전화번호:</span> 010-8285-5136
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} 뉴씽크. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
