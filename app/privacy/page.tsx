export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>

      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed mb-4">
          뉴씽크(이하 "회사")는 개인정보 보호법 제30조에 따라 정보주체의
          개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
          있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 1 조 (개인정보의 처리 목적)
        </h2>
        <p className="text-gray-700 mb-3">
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
          개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
          변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등
          필요한 조치를 이행할 예정입니다.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              1. 회원 가입 및 관리
            </h3>
            <p className="text-gray-700 pl-4">
              회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
              회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리
              목적으로 개인정보를 처리합니다.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              2. 재화 또는 서비스 제공
            </h3>
            <p className="text-gray-700 pl-4">
              서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증,
              요금결제·정산을 목적으로 개인정보를 처리합니다.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              3. 마케팅 및 광고에의 활용
            </h3>
            <p className="text-gray-700 pl-4">
              신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보
              제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및
              광고 게재, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스
              이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 2 조 (개인정보의 처리 및 보유 기간)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
            개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서
            개인정보를 처리·보유합니다.
          </li>
          <li>
            각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>회원 가입 및 관리</strong>: 회원 탈퇴 시까지. 다만,
                다음의 사유에 해당하는 경우에는 해당 사유 종료시까지
                <ul className="list-circle pl-6 mt-1 space-y-1">
                  <li>
                    관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당
                    수사·조사 종료시까지
                  </li>
                  <li>
                    서비스 이용에 따른 채권·채무관계 잔존시에는 해당
                    채권·채무관계 정산시까지
                  </li>
                </ul>
              </li>
              <li>
                <strong>재화 또는 서비스 제공</strong>: 재화·서비스 공급완료 및
                요금결제·정산 완료시까지. 다만, 다음의 사유에 해당하는 경우에는
                해당 기간 종료시까지
                <ul className="list-circle pl-6 mt-1 space-y-1">
                  <li>
                    「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른
                    표시·광고, 계약내용 및 이행 등 거래에 관한 기록: 5년
                  </li>
                  <li>
                    「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른
                    소비자의 불만 또는 분쟁처리에 관한 기록: 3년
                  </li>
                  <li>「통신비밀보호법」에 따른 로그인 기록: 3개월</li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 3 조 (처리하는 개인정보의 항목)
        </h2>
        <p className="text-gray-700 mb-3">
          회사는 다음의 개인정보 항목을 처리하고 있습니다.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              1. 회원 가입 및 관리
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>필수항목: 이메일 주소, 비밀번호, 이름</li>
              <li>선택항목: 프로필 사진, 전화번호</li>
              <li>소셜 로그인 시: 소셜 계정 정보(이메일, 이름, 프로필 사진)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              2. 재화 또는 서비스 제공
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>필수항목: 결제정보(카드사명, 카드번호 일부), 구매내역</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              3. 인터넷 서비스 이용과정에서 자동 생성·수집되는 정보
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>
                IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록
                등
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 4 조 (개인정보의 제3자 제공)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한
            범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
            개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를
            제3자에게 제공합니다.
          </li>
          <li>
            회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
            <div className="mt-3 p-4 bg-gray-50 rounded">
              <p className="font-semibold mb-2">결제 서비스 제공자</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>제공받는 자: 결제대행업체(토스)</li>
                <li>제공 목적: 결제 처리 및 정산</li>
                <li>제공 항목: 구매자명, 결제정보, 구매내역</li>
                <li>보유 및 이용기간: 거래 종료 후 5년</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 5 조 (개인정보처리의 위탁)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
            처리업무를 위탁하고 있습니다.
            <div className="mt-3 space-y-3">
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-semibold mb-2">클라우드 서비스</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>수탁업체: Supabase Inc.</li>
                  <li>위탁업무 내용: 데이터 저장 및 관리</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <p className="font-semibold mb-2">결제 서비스</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>수탁업체: [결제대행업체명]</li>
                  <li>위탁업무 내용: 결제 처리 및 정산</li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            회사는 위탁계약 체결시 개인정보 보호법 제26조에 따라 위탁업무
            수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한,
            수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등
            문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고
            있습니다.
          </li>
          <li>
            위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보
            처리방침을 통하여 공개하도록 하겠습니다.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 6 조 (정보주체의 권리·의무 및 행사방법)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련
            권리를 행사할 수 있습니다.
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </li>
          <li>
            제1항에 따른 권리 행사는 회사에 대해 개인정보 보호법 시행규칙 별지
            제8호 서식에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수
            있으며 회사는 이에 대해 지체없이 조치하겠습니다.
          </li>
          <li>
            정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한
            경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를
            이용하거나 제공하지 않습니다.
          </li>
          <li>
            제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등
            대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙
            별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 7 조 (개인정보의 파기)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
            불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
          </li>
          <li>
            정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이
            달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야
            하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나
            보관장소를 달리하여 보존합니다.
          </li>
          <li>
            개인정보 파기의 절차 및 방법은 다음과 같습니다.
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>파기절차</strong>: 회사는 파기 사유가 발생한 개인정보를
                선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를
                파기합니다.
              </li>
              <li>
                <strong>파기방법</strong>: 회사는 전자적 파일 형태로 기록·저장된
                개인정보는 기록을 재생할 수 없도록 로우레밸포멧(Low Level
                Format) 등의 방법을 이용하여 파기하며, 종이 문서에 기록·저장된
                개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 8 조 (개인정보의 안전성 확보조치)
        </h2>
        <p className="text-gray-700 mb-3">
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
          있습니다.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            <strong>관리적 조치</strong>: 내부관리계획 수립·시행, 정기적 직원
            교육 등
          </li>
          <li>
            <strong>기술적 조치</strong>: 개인정보처리시스템 등의 접근권한 관리,
            접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치
          </li>
          <li>
            <strong>물리적 조치</strong>: 전산실, 자료보관실 등의 접근통제
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 9 조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를
            저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
          </li>
          <li>
            쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터
            브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의
            하드디스크에 저장되기도 합니다.
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>쿠키의 사용 목적</strong>: 이용자가 방문한 각 서비스와
                웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부,
                등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
              </li>
              <li>
                <strong>쿠키의 설치·운영 및 거부</strong>: 웹브라우저 상단의
                도구 {">"} 인터넷 옵션 {">"} 개인정보 메뉴의 옵션 설정을 통해
                쿠키 저장을 거부 할 수 있습니다.
              </li>
              <li>
                <strong>쿠키 저장을 거부할 경우</strong>: 맞춤형 서비스 이용에
                어려움이 발생할 수 있습니다.
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 10 조 (개인정보 보호책임자)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
            처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
            같이 개인정보 보호책임자를 지정하고 있습니다.
            <div className="mt-3 p-4 bg-gray-50 rounded">
              <p className="font-semibold mb-2">▶ 개인정보 보호책임자</p>
              <ul className="space-y-1">
                <li>성명: 박영호</li>
                <li>직책: 대표</li>
                <li>연락처: snu910501@naver.com</li>
              </ul>
            </div>
          </li>
          <li>
            정보주체께서는 회사의 서비스(또는 사업)을 이용하시면서 발생한 모든
            개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을
            개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는
            정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 11 조 (개인정보 열람청구)
        </h2>
        <p className="text-gray-700 leading-relaxed">
          정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의
          부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게
          처리되도록 노력하겠습니다.
        </p>
        <div className="mt-3 p-4 bg-gray-50 rounded">
          <p className="font-semibold mb-2">
            ▶ 개인정보 열람청구 접수·처리 부서
          </p>
          <ul className="space-y-1 text-gray-700">
            <li>부서명: 고객지원팀</li>
            <li>담당자: [담당자명]</li>
            <li>연락처: snu910501@naver.com</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 12 조 (권익침해 구제방법)
        </h2>
        <p className="text-gray-700 mb-3">
          정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을
          문의하실 수 있습니다.
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">
              ▶ 개인정보 침해신고센터 (한국인터넷진흥원 운영)
            </p>
            <ul className="space-y-1 text-gray-700">
              <li>소관업무: 개인정보 침해사실 신고, 상담 신청</li>
              <li>홈페이지: privacy.kisa.or.kr</li>
              <li>전화: (국번없이) 118</li>
              <li>
                주소: (05717) 서울특별시 송파구 중대로 135 한국인터넷진흥원
                개인정보침해신고센터
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">▶ 개인정보 분쟁조정위원회</p>
            <ul className="space-y-1 text-gray-700">
              <li>
                소관업무: 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)
              </li>
              <li>홈페이지: www.kopico.go.kr</li>
              <li>전화: (국번없이) 1833-6972</li>
              <li>
                주소: (03171) 서울특별시 종로구 세종대로 209 정부서울청사 4층
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">▶ 대검찰청 사이버범죄수사단</p>
            <ul className="space-y-1 text-gray-700">
              <li>전화: 02-3480-3573</li>
              <li>홈페이지: www.spo.go.kr</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">▶ 경찰청 사이버안전국</p>
            <ul className="space-y-1 text-gray-700">
              <li>전화: (국번없이) 182</li>
              <li>홈페이지: cyberbureau.police.go.kr</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          제 13 조 (개인정보 처리방침 변경)
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>이 개인정보 처리방침은 2025. 11. 2부터 적용됩니다.</li>
          <li>
            이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
            <ul className="list-disc pl-6 mt-2">
              <li>현재 적용되는 최초 버전입니다.</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-8 p-4 bg-blue-50 rounded">
        <p className="text-gray-700">
          <strong>공고 일자:</strong> 2025년 11월 2일
          <br />
          <strong>시행 일자:</strong> 2025년 11월 2일
        </p>
      </section>

      <section className="mb-8 p-4 bg-gray-50 rounded">
        <p className="text-gray-700">
          개인정보 처리방침과 관련하여 궁금하신 사항이 있으시면{" "}
          <a
            href="mailto:snu910501@naver.com"
            className="text-blue-600 hover:underline"
          >
            snu910501@naver.com
          </a>
          로 문의 주시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
