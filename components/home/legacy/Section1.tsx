import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const Section1 = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center px-4 ">
      <div className="w-full mx-auto  text-center space-y-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground bg-gray-100">
          <Sparkles className="h-4 w-4" />
          AI 기반 창업 가이드
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-tight">
          1인 창업, 더 이상 막막해하지 마세요
        </h1>

        <p className="text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
          1인 창업의 첫걸음부터 성공까지 함께합니다. <br /> 아이템 발굴부터 성장
          전략까지, 체계적인 가이드를 제공합니다
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button>
            <Link
              href="#"
              className="flex items-center justify-center gap-4 px-5 py-3 text-lg font-semibold rounded-lg bg-[#214061] hover:bg-[#214061]/90 text-white"
            >
              AI로 내게 맞는 창업 아이템 추천받기
              <ArrowRight></ArrowRight>
            </Link>
          </button>
          <button>
            <Link
              href="#"
              className="flex items-center justify-center gap-4 px-5 py-3 text-lg font-semibold rounded-lg bg-white text-black border-1 border-black/10 hover:border-black/30"
            >
              108가지 창업사례 보러가기
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section1;
