import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, BarChart3, Search, FileText, MessageSquare, BrainCircuit, Users, Clock, Target, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// セミナー情報の定義
const seminar = {
  id: "vol1",
  title: "「マッチング精度」を最大化する",
  subtitle: "～人材と案件のマッチングをAIで効率化する～",
  date: "2026年2月10日(火)",
  time: "14:00～15:00",
  image: "/seminar-vol1.png",
  description: "案件理解・人材マッチング・提案資料作成・進捗管理をAIで効率化。営業を「本来の仕事」に集中させる具体的メソッドを解説！"
};

export default function Home() {

  const [formData, setFormData] = useState({
    company: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    challenge: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRegistration = trpc.seminar.submitRegistration.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.company.trim()) errors.company = "会社名は必須です";
    if (!formData.name.trim()) errors.name = "名前は必須です";
    if (!formData.position.trim()) errors.position = "役職は必須です";
    if (!formData.email.trim()) errors.email = "メールアドレスは必須です";
    if (!formData.email.includes("@")) errors.email = "有効なメールアドレスを入力してください";
    if (!formData.phone.trim()) errors.phone = "電話番号は必須です";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await submitRegistration.mutateAsync({
        company: formData.company,
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        challenge: formData.challenge,
      });

      if (result.success) {
        toast.success("申し込みが完了しました。確認メールをご確認ください。");
        setFormData({
          company: "",
          name: "",
          position: "",
          email: "",
          phone: "",
          challenge: "",
        });
      } else {
        toast.error("申し込み処理中にエラーが発生しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("申し込み処理中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="SI Development Control Room" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
          
          {/* Animated Tech Lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-cyan-500/50" />
            <div className="absolute top-3/4 left-0 w-full h-[1px] bg-cyan-500/50" />
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-cyan-500/50" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-cyan-500/50" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6 px-6 py-2 text-sm border-cyan-500 text-cyan-400 bg-cyan-500/10">
              anyenv株式会社主催ウェビナー
            </Badge>
            
            <div className="mb-8">
              <p className="text-cyan-400 text-lg mb-2">人材DXウェビナー 営業改革シリーズ</p>
              <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 text-base">
                参加無料
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              人材業界の営業を<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                AIで変革する
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              案件理解・人材マッチング・提案資料作成・進捗管理をAIで効率化し、<br />
              営業を「本来の仕事」に集中させる具体的メソッドを解説！
            </p>

            {/* 特典情報 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4,
                type: "spring",
                stiffness: 100
              }}
              className="mb-10 max-w-2xl mx-auto"
            >
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                    "0 0 40px rgba(251, 191, 36, 0.8)",
                    "0 0 20px rgba(251, 191, 36, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 rounded-xl p-1"
              >
                <div className="bg-slate-900 rounded-lg p-6 md:p-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Gift className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                      参加特典
                    </h3>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-yellow-300" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg md:text-xl text-white font-bold">
                      すぐに使える<span className="text-amber-300">営業活用事例集</span>を<br className="sm:hidden" />
                      <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">無料プレゼント！</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                今すぐ申し込む（無料）
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-cyan-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Seminar Details Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">セミナー概要</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-cyan-500 shadow-xl overflow-hidden">
              <div className="relative h-80 md:h-96">
                <img 
                  src={seminar.image} 
                  alt={seminar.title}
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{seminar.title}</h3>
                <p className="text-lg text-cyan-600 mb-4">{seminar.subtitle}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="h-5 w-5 text-cyan-600" />
                    <span className="font-semibold">{seminar.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="h-5 w-5 text-cyan-600" />
                    <span className="font-semibold">{seminar.time}</span>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">{seminar.description}</p>
                <div className="bg-slate-100 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-slate-700"><strong>開催形式:</strong> オンライン（Google Meet）</p>
                  <p className="text-sm text-slate-700"><strong>途中参加・途中退出:</strong> OK</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">こんなお悩みありませんか？</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {[
              { icon: FileText, text: "案件理解・要件整理に時間がかかる", detail: "求人票・案件票がバラバラで、必須スキルが分からず提案スピードが落ちる" },
              { icon: Users, text: "人材と案件のマッチングが属人的", detail: "ベテラン営業の「勘」や「記憶」に依存し、良い人材が眠りミスマッチが増える" },
              { icon: MessageSquare, text: "提案資料・推薦文の作成が手作業", detail: "スキルシートを見て文章を毎回手書き、「作る時間」ばかりかかる" },
              { icon: BarChart3, text: "フォロー・進捗管理が後回しになる", detail: "誰にいつ連絡すべきか分からず、対応漏れで成約機会を逃す" },
            ].map((problem, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border-2 border-slate-200 hover:border-cyan-500 transition-all duration-300 shadow-sm hover:shadow-lg">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                      <problem.icon className="h-6 w-6 text-cyan-600" />
                    </div>
                    <p className="text-lg text-slate-700 font-medium pt-2">{problem.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-cyan-600">その課題、Geminiで解決できます。</p>
          </div>
        </div>
      </section>

      {/* Learning Points Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">本セミナーで学べること</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
            <p className="text-lg text-slate-600 mt-6">人材業界の営業現場で実際に使える、4つの実践スキルを習得できます。</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: FileText,
                title: "案件情報をAIが自動で構造化",
                description: "AIが求人・案件文を解析して、必須スキル・尚可スキル・勤務条件・優先度を自動整理。営業は「読む」ではなく「判断」だけで済み、案件理解の時間を大幅削減。"
              },
              {
                icon: Users,
                title: "AIがマッチ候補人材を自動抽出",
                description: "AIが案件条件・スキルシート・過去成約データを横断検索し、「この案件に合う人材TOP5」を提示。属人性を排除し、誰でも一定品質のマッチングが可能に。"
              },
              {
                icon: MessageSquare,
                title: "提案文・推薦コメントをAIが自動生成",
                description: "AIが案件要件と人材スキルをもとに「この案件に合う理由」を文章化。提案作成時間を大幅短縮し、表現の品質が統一され、新人でも即戦力に。"
              },
              {
                icon: BrainCircuit,
                title: "次にやるべき営業行動をAIが提案",
                description: "AIが進捗・未対応期間・返信状況を見て「今日やるべき営業タスク」を提示。例：「3日連絡していないA社にフォロー」「書類通過したB社へ面談調整」。対応漏れ防止で成約率アップ。"
              },
            ].map((point, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader className="bg-gradient-to-br from-cyan-50 to-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                        <point.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-slate-900">{point.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-slate-700 leading-relaxed">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">よくある質問</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white border-2 border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                  AIの知識がなくても参加できますか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい、AIの知識がない方でも問題ありません。
                  実務ですぐに使える具体的な活用方法をわかりやすく解説します。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border-2 border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                  途中参加・途中退出は可能ですか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい、可能です。業務の都合で途中参加・途中退出される場合も、
                  お気軽にご参加ください。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border-2 border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                  資料は配布されますか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい、セミナー終了後に参加者の皆様へ資料をメールでお送りします。
                  復習や社内共有にご活用ください。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border-2 border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                  複数名での参加は可能ですか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい、可能です。チームでの参加も大歓迎です。
                  お一人ずつお申し込みいただくか、代表者の方がまとめてお申し込みください。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border-2 border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                  録画視聴は可能ですか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  申し訳ございませんが、録画視聴のご提供は予定しておりません。
                  リアルタイムでのご参加をお願いいたします。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">なぜ"無料"で実施するのか</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mb-12" />
            
            <div className="text-left space-y-6 text-slate-700 leading-relaxed text-lg">
              <p>
                私たちは、AIを活用することで業務改善が実際に進むということを、<br />
                まずは体感していただきたいと考えています。
              </p>
              <p>
                単なる知識提供ではなく、<br />
                「自社の業務にどう活かせるのか」「どこが効率化できそうか」を<br />
                具体的にイメージしていただくことが目的です。
              </p>
              <p className="font-semibold text-cyan-700">
                まずは60分、"成果につながるAI活用"を体験してください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">参加概要</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Users className="h-6 w-6 text-cyan-600" />
                  対象
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>人材企業の営業担当者</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>営業企画・管理職の方</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Clock className="h-6 w-6 text-blue-600" />
                  日時・所要時間
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{seminar.date}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{seminar.time}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>約60分</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <Target className="h-6 w-6 text-indigo-600" />
                  開催形式
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>オンライン（Google Meet）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>※全国どこからでも参加可能</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-500 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <CheckCircle2 className="h-6 w-6 text-cyan-600" />
                  参加費
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-cyan-600">無料</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section Before Form */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500" />
        </div>
        
        <div className="container px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              営業のやり方、<br />
              そろそろアップデートしませんか？
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Geminiで変わる"次世代の人材営業"を体験してください。
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              今すぐ申し込む（無料）
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">参加申し込み</h2>
              <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
            </div>

            <Card className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-slate-900 mb-2">
                      会社名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="〇〇システム株式会社"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                    {formErrors.company && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.company}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                      名前 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="山田太郎"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-semibold text-slate-900 mb-2">
                      役職 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="営業部長"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                    {formErrors.position && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.position}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="090-1234-5678"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="challenge" className="block text-sm font-semibold text-slate-900 mb-2">
                      課題に感じていること
                    </label>
                    <textarea
                      id="challenge"
                      value={formData.challenge}
                      onChange={handleInputChange}
                      placeholder="例：提案書作成に時間がかかる、技術調査が属人化している..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "送信中..." : "無料で参加登録する"}
                  </Button>

                  <div className="text-center text-sm text-slate-600 space-y-1">
                    <p>※ 研修に関して、事前にご連絡させていただく場合がございます。</p>
                    <p>※ 同業他社様のご参加はお断りする場合がございます。</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">会社概要</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>会社名:anyenv株式会社</p>
                <p>代表取締役:四宮 浩二</p>
                <p>住所:東京都渋谷区道玄坂2-25-12<br />道玄坂通5F</p>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                anyenv株式会社は、エージェントグループ(証券コード:7098)の<br />
                DX・AI専門関連会社です
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">お問い合わせ</h3>
              <a href="mailto:info@anyenv-inc.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                info@anyenv-inc.com
              </a>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">その他</h3>
              <a href="https://www.anyenv-inc.com/privacypolicy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                プライバシーポリシー
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
