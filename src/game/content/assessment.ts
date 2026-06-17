import type { DimensionKey, ProfileDefinition } from "../simulation/scoring";

export const dimensionLabels: Record<DimensionKey, string> = {
  leadership: "领导与影响力",
  cooperation: "协作倾向",
  innovation: "创新创造力",
  analysis: "分析决策",
  stress: "抗压适应力",
  execution: "执行力",
};

export type StageOption = {
  id: string;
  label: string;
  description: string;
  teammate: string;
  scoreDeltas: Partial<Record<DimensionKey, number>>;
  evidence: string;
};

export type AssessmentStage = {
  id: string;
  title: string;
  stationLabel: string;
  objective: string;
  prompt: string;
  primaryDimensions: DimensionKey[];
  options: StageOption[];
};

export const assessmentStages: AssessmentStage[] = [
  {
    id: "info-fragments",
    title: "阶段 1：信息碎片",
    stationLabel: "线索终端",
    objective: "拼出城市 AI 失控的真实原因",
    prompt: "不同队友掌握了不完整线索。你会先怎么推进？",
    primaryDimensions: ["analysis", "cooperation"],
    options: [
      {
        id: "share-evidence",
        label: "同步全部线索",
        description: "先让队友公开关键证据，再共同标记矛盾点。",
        teammate: "协调员：如果大家先对齐信息，误判会少很多。",
        scoreDeltas: { cooperation: 12, analysis: 7, leadership: 3 },
        evidence: "你优先促进线索共享，降低了团队信息不对称。",
      },
      {
        id: "map-patterns",
        label: "绘制因果图",
        description: "整理交通、医疗、能源异常的时间顺序和因果关系。",
        teammate: "分析员：我支持先画出变量关系，别急着下结论。",
        scoreDeltas: { analysis: 14, execution: 5, cooperation: 2 },
        evidence: "你用结构化方式识别关键变量和风险链条。",
      },
      {
        id: "rush-answer",
        label: "快速拍板",
        description: "直接锁定最显眼的问题，节省讨论时间。",
        teammate: "执行员：速度有了，但我们可能漏掉隐含故障。",
        scoreDeltas: { leadership: 6, execution: 4, analysis: -8, cooperation: -4 },
        evidence: "你倾向快速决断，但存在跳过验证的风险。",
      },
    ],
  },
  {
    id: "resource-allocation",
    title: "阶段 2：资源分配",
    stationLabel: "资源沙盘",
    objective: "在预算、人员、时间有限时决定优先级",
    prompt: "五个系统同时报警，资源只能覆盖其中三项。你会怎样分配？",
    primaryDimensions: ["leadership", "cooperation", "execution"],
    options: [
      {
        id: "balanced-triage",
        label: "团队共识分诊",
        description: "先按影响范围排序，再听取队友对民生系统的补充意见。",
        teammate: "协调员：这能兼顾效率和团队接受度。",
        scoreDeltas: { cooperation: 8, leadership: 7, execution: 7, analysis: 3 },
        evidence: "你在资源紧张时兼顾优先级和团队共识。",
      },
      {
        id: "delegate-plan",
        label: "明确分工推进",
        description: "指定每名队友负责一个系统，并设定三分钟内反馈节点。",
        teammate: "执行员：我能马上接医疗系统，按节点回报。",
        scoreDeltas: { leadership: 8, execution: 13, analysis: 5 },
        evidence: "你将目标拆解为明确任务，并推动稳定执行。",
      },
      {
        id: "protect-one-system",
        label: "押注单一系统",
        description: "把资源集中到能源系统，先保住城市底层供给。",
        teammate: "分析员：这很果断，但外溢风险需要说明。",
        scoreDeltas: { leadership: 8, stress: 2, cooperation: -5, analysis: -2 },
        evidence: "你在不确定下敢于押注，但协作解释不足。",
      },
    ],
  },
  {
    id: "creative-solution",
    title: "阶段 3：方案创造",
    stationLabel: "方案白板",
    objective: "提出原方案之外的替代恢复路径",
    prompt: "官方预案只能修复一半系统。你会提出什么替代方案？",
    primaryDimensions: ["innovation", "analysis", "cooperation"],
    options: [
      {
        id: "adaptive-network",
        label: "临时自治网络",
        description: "让社区节点临时自治，城市 AI 只保留数据校验功能。",
        teammate: "分析员：新颖，而且能解释为什么降低单点故障。",
        scoreDeltas: { innovation: 14, analysis: 10, execution: 4 },
        evidence: "你提出了兼具新颖性、可行性和执行路径的替代方案。",
      },
      {
        id: "public-cocreation",
        label: "公众协作修复",
        description: "公开低风险任务，让志愿者和高校团队参与数据标注。",
        teammate: "协调员：这会提高社会参与，但需要质量控制。",
        scoreDeltas: { innovation: 10, cooperation: 10, leadership: 3 },
        evidence: "你将外部协作纳入恢复策略，扩展了团队资源边界。",
      },
      {
        id: "repeat-official-plan",
        label: "坚持官方预案",
        description: "不引入新变量，按既有流程逐项恢复。",
        teammate: "执行员：稳定，但解决不了预案覆盖不足。",
        scoreDeltas: { execution: 8, innovation: -8, stress: 2 },
        evidence: "你偏向稳定流程，创新替代方案不足。",
      },
    ],
  },
  {
    id: "sudden-crisis",
    title: "阶段 4：突发危机",
    stationLabel: "危机警报",
    objective: "在规则变化和资源削减后保持推进",
    prompt: "新数据推翻了前提，且资源削减 30%。你会怎么调整？",
    primaryDimensions: ["stress", "execution", "leadership"],
    options: [
      {
        id: "replan-calmly",
        label: "冷静重排方案",
        description: "暂停 20 秒复核假设，保留已验证路径，重排优先级。",
        teammate: "分析员：这能避免压力下乱试。",
        scoreDeltas: { stress: 12, execution: 10, analysis: 8 },
        evidence: "你在压力事件后快速恢复，并基于证据重排计划。",
      },
      {
        id: "rally-team",
        label: "稳定团队情绪",
        description: "先确认每个队友的可执行任务，再压缩非关键目标。",
        teammate: "协调员：大家知道下一步做什么，就不会散。",
        scoreDeltas: { stress: 10, cooperation: 8, leadership: 8 },
        evidence: "你在突发变化中稳定团队并维持协作。",
      },
      {
        id: "panic-switch",
        label: "全面换方案",
        description: "放弃现有路径，立刻尝试全新方案。",
        teammate: "执行员：有行动，但切换成本会很高。",
        scoreDeltas: { innovation: 5, stress: -10, execution: -5 },
        evidence: "你愿意尝试新路，但压力下的稳定推进不足。",
      },
    ],
  },
  {
    id: "final-briefing",
    title: "阶段 5：最终发布",
    stationLabel: "发布台",
    objective: "提交城市恢复方案并生成测评反馈",
    prompt: "评审只给你一分钟。你会怎样汇报最终方案？",
    primaryDimensions: ["execution", "leadership", "analysis"],
    options: [
      {
        id: "evidence-briefing",
        label: "证据链汇报",
        description: "按问题、证据、方案、风险、分工五段提交。",
        teammate: "分析员：评审能清楚看到你的判断依据。",
        scoreDeltas: { analysis: 12, execution: 11, leadership: 3 },
        evidence: "你用证据和结构化表达完成最终交付。",
      },
      {
        id: "team-credit",
        label: "团队贡献汇报",
        description: "突出每名队友的贡献，并说明协作如何改善结果。",
        teammate: "协调员：这能体现团队过程，不只是个人表现。",
        scoreDeltas: { cooperation: 10, leadership: 7, execution: 4 },
        evidence: "你能整合团队贡献并形成共同成果。",
      },
      {
        id: "bold-vision",
        label: "愿景式发布",
        description: "用更强叙事打动评审，强调城市未来升级方向。",
        teammate: "执行员：很有感染力，但需要落到执行细节。",
        scoreDeltas: { leadership: 9, innovation: 8, execution: -2 },
        evidence: "你善于提出方向和动员愿景，但执行细节需补强。",
      },
    ],
  },
];

export const profileDefinitions: ProfileDefinition[] = [
  {
    dimensions: ["leadership", "execution"],
    title: "影响推动型",
    summary: "你倾向主动组织任务、明确分工，并推动团队把方案落到行动。",
    jobDirections: ["项目管理", "产品运营", "活动统筹", "管理培训生"],
    developmentAdvice: "继续练习在推动速度和听取证据之间保持平衡。",
  },
  {
    dimensions: ["cooperation", "stress"],
    title: "协作支持型",
    summary: "你倾向维护团队连接，在压力下帮助团队保持稳定。",
    jobDirections: ["HR", "用户运营", "教育服务", "客户成功"],
    developmentAdvice: "可以补强决策表达，让支持行为更容易转化为团队结果。",
  },
  {
    dimensions: ["innovation", "analysis"],
    title: "创新策略型",
    summary: "你能把新颖方案和逻辑判断结合起来，适合探索不确定问题。",
    jobDirections: ["产品策划", "游戏策划", "用户研究", "创意设计"],
    developmentAdvice: "注意把创意拆成可执行步骤，降低落地阻力。",
  },
  {
    dimensions: ["analysis", "execution"],
    title: "稳定解决型",
    summary: "你倾向用证据拆解问题，并以稳定节奏推进解决方案。",
    jobDirections: ["数据分析", "流程优化", "测试/质控", "运营分析"],
    developmentAdvice: "可以增加方案表达的感染力，让判断更容易获得团队响应。",
  },
  {
    dimensions: ["stress", "execution"],
    title: "应变行动型",
    summary: "你在变化和压力下仍能保持行动，并快速调整执行路径。",
    jobDirections: ["应急运营", "现场执行", "服务管理", "创业团队执行"],
    developmentAdvice: "注意在快速行动前保留短暂复核，避免压力下过度试错。",
  },
  {
    dimensions: ["leadership", "cooperation"],
    title: "组织协调型",
    summary: "你倾向整合队友信息、协调分工，并通过合作形成共同成果。",
    jobDirections: ["项目协调", "HRBP 助理", "社团管理", "团队负责人助理"],
    developmentAdvice: "继续区分健康领导和强势控制，让协作空间更充分。",
  },
];
