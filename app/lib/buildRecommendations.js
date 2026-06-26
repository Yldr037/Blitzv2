// League of Legends Item Database & Recommendation Resolver
// Maps Item IDs to Riot Data Dragon assets: https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png

const ITEMS = {
  // Starters
  doransRing: { id: 1056, name: "Doran'ın Yüzüğü", cost: 400 },
  doransBlade: { id: 1055, name: "Doran'ın Kılıcı", cost: 450 },
  doransShield: { id: 1054, name: "Doran'ın Kalkanı", cost: 450 },
  healthPotion: { id: 2003, name: "Can İksiri", cost: 50 },
  worldAtlas: { id: 3865, name: "Dünya Atlası (Destek)", cost: 400 },
  scorchclawPup: { id: 1101, name: "Alazpençe Yavrusu", cost: 450 },
  mosstomperSeedling: { id: 1103, name: "Yosunezen Yavrusu", cost: 450 },
  gustwalkerHatchling: { id: 1102, name: "Yelgezer Yavrusu", cost: 450 },
  tear: { id: 3070, name: "Tanrıça'nın Gözyaşı", cost: 400 },

  // Boots
  sorcerersShoes: { id: 3020, name: "Sihirbaz Pabuçları", cost: 1100 },
  platedSteelcaps: { id: 3047, name: "Çelik Kaplamalı Çizme", cost: 1000 },
  mercurysTreads: { id: 3111, name: "Merkür'ün Adımları", cost: 1200 },
  berserkersGreaves: { id: 3006, name: "Savaşçı Çizmeleri", cost: 1100 },
  ionianBoots: { id: 3158, name: "Ionia Çizmeleri", cost: 900 },
  swiftnessBoots: { id: 3009, name: "Sürat Çizmeleri", cost: 900 },

  // AP Items
  ludensCompanion: { id: 6655, name: "Luden'in Feryadı", cost: 2900 },
  archangelsStaff: { id: 3003, name: "Başmelek Asası", cost: 2900 },
  shadowflame: { id: 4645, name: "Gölgealev", cost: 3200 },
  liandrysTorment: { id: 3151, name: "Liandry'nin Eziyeti", cost: 3000 },
  rabadonsDeathcap: { id: 3089, name: "Rabadon'un Ölüm Şapkası", cost: 3600 },
  zhonyasHourglass: { id: 3157, name: "Zhonya'nın Kumsaati", cost: 3250 },
  voidStaff: { id: 3135, name: "Void Değneği", cost: 3000 },
  cryptbloom: { id: 3137, name: "Kriptoçiçek", cost: 2850 },
  morellonomicon: { id: 3165, name: "Morellonomikon", cost: 2200 },
  rylai: { id: 3116, name: "Rylai'nin Kristal Asası", cost: 2600 },
  cosmicDrive: { id: 4629, name: "Kozmik Hızlandırıcı", cost: 3000 },
  lichBane: { id: 3100, name: "Lich Boğan", cost: 3100 },

  // AD/ADC Items
  krakenSlayer: { id: 3033, name: "Kraken Katili", cost: 3000 },
  infinityEdge: { id: 3031, name: "Ebedi Kılıç", cost: 3400 },
  lordDominiks: { id: 3036, name: "Dominik Efendi'nin Hürmeti", cost: 3000 },
  bloodthirster: { id: 3072, name: "Kanasusamış", cost: 3400 },
  guardianAngel: { id: 3026, name: "Koruyucu Melek", cost: 3000 },
  phantomDancer: { id: 3046, name: "Hayalet Dansçı", cost: 2600 },
  rapidFirecannon: { id: 3094, name: "Cümbüş Ateşi", cost: 2600 },
  collector: { id: 6676, name: "Tahsilatçı", cost: 3200 },
  ruinedKing: { id: 3153, name: "Mahvolmuş Kralın Kılıcı", cost: 3200 },
  guinsoos: { id: 3124, name: "Guinsoo'nun Hiddeti", cost: 3000 },

  // Fighter Items
  trinityForce: { id: 3078, name: "Üçlü Kuvvet", cost: 3333 },
  blackCleaver: { id: 3071, name: "Kara Balta", cost: 3000 },
  spearOfShojin: { id: 3161, name: "Shojin'in Mızrağı", cost: 3100 },
  steraksGage: { id: 3053, name: "Sterak'ın Güvencesi", cost: 3000 },
  deathsDance: { id: 3010, name: "Ölümün Dansı", cost: 3200 },
  eclipse: { id: 6692, name: "Kararma", cost: 2900 },
  sundererSky: { id: 6610, name: "Yarık Gökyüzü", cost: 3100 },
  shojin: { id: 3161, name: "Shojin'in Mızrağı", cost: 3100 },
  ravenousHydra: { id: 3074, name: "Vahşi Hydra", cost: 3300 },
  titanicHydra: { id: 3077, name: "Devasa Hydra", cost: 3300 },
  mawOfMalmortius: { id: 3156, name: "Malmortius'un Ağzı", cost: 2800 },

  // Tank Items
  sunfireAegis: { id: 3068, name: "Günateşi Pelerini", cost: 2700 },
  thornmail: { id: 3075, name: "Çivili Zırh", cost: 2700 },
  spiritVisage: { id: 3065, name: "Ruh Gömleği", cost: 2800 },
  jaksho: { id: 6665, name: "Şahbaz Jak'Sho", cost: 3200 },
  kaenicRookern: { id: 2504, name: "Kutluyas Rukern", cost: 2900 },
  randuinsOmen: { id: 3143, name: "Randuin'in Alameti", cost: 2700 },
  warmogsArmor: { id: 3083, name: "Warmog'un Zırhı", cost: 3100 },
  heartsteel: { id: 3084, name: "Çelikyürek", cost: 3000 },
  hollowRadiance: { id: 6664, name: "Donuk Işıltı", cost: 2800 },
  frozenHeart: { id: 3110, name: "Donmuş Yürek", cost: 2300 },
  deadmansPlate: { id: 3742, name: "Ölü Adamın Zırhı", cost: 2900 },

  // Support Items
  moonstoneRenewer: { id: 6617, name: "Aytaşı Yenileyici", cost: 2200 },
  shurelyasBattlesong: { id: 2065, name: "Shurelya'nın Savaş Şarkısı", cost: 2200 },
  redemption: { id: 3107, name: "Kefaret", cost: 2200 },
  ardentCenser: { id: 3504, name: "Kızgın Buhurdanlık", cost: 2200 },
  flowingWaterStaff: { id: 4642, name: "Akan Su Asası", cost: 2200 },
  dawncore: { id: 6621, name: "Şafağın Özü", cost: 2500 },
  locketSolari: { id: 3190, name: "Demir Solari'nin Broşu", cost: 2200 },
  knightsVow: { id: 3050, name: "Şövalyenin Adanmışlığı", cost: 2200 },
  zekesConvergence: { id: 3052, name: "Zeke'nin Ahengi", cost: 2200 },
  trailblazer: { id: 3002, name: "Öncünün Çantası", cost: 2400 },

  // Assassin Items
  hubris: { id: 6697, name: "Kibir", cost: 2800 },
  opportunity: { id: 6701, name: "Fırsat", cost: 2700 },
  youmuus: { id: 3142, name: "Youmuu'nun Hayaletkılıcı", cost: 2700 },
  edgeOfNight: { id: 3211, name: "Gecenin Kıyısı", cost: 2800 },
  seryldasGrudge: { id: 3035, name: "Serylda'nın Garezi", cost: 3200 },
  profaneHydra: { id: 6698, name: "İtikatsız Hydra", cost: 2850 },
};

export const RUNES = {
  aery: { 
    name: "Aery'yi Çağır", 
    icon: "Sorcery/SummonAery/SummonAery.png", 
    path: "Büyücülük",
    description: "Saldırıların ve yeteneklerin rakiplere hasar veren veya dostlarına kalkan/iyileştirme uyguladığında onları ek bir kalkanla koruyan Aery'yi yollar. Hem dürtme hem de koruma için mükemmeldir."
  },
  comet: { 
    name: "Sihirli Yıldız", 
    icon: "Sorcery/ArcaneComet/ArcaneComet.png", 
    path: "Büyücülük",
    description: "Bir rakip şampiyona yetenek isabet ettirdiğinde onun bulunduğu konuma gökten hasar veren bir yıldız fırlatır. Yetenekleriyle rakibi uzaktan dürten büyücüler için idealdir."
  },
  electrocute: { 
    name: "Elektrik Ver", 
    icon: "Domination/Electrocute/Electrocute.png", 
    path: "Hakimiyet",
    description: "Bir rakip şampiyona 3 saniye içinde 3 farklı yetenek veya saldırı isabet ettirdiğinde fazladan anlık büyü hasarı verir. Hızlı takaslar ve tek atma odaklı suikastçılar için en iyi tercihtir."
  },
  darkHarvest: { 
    name: "Kara Hasat", 
    icon: "Domination/DarkHarvest/DarkHarvest.png", 
    path: "Hakimiyet",
    description: "Canı %50'nin altındaki şampiyonlara hasar vermek onlara fazladan değişken hasar uygular ve ruhlarını hasat eder. Her ruh hasatı bu rünün hasarını kalıcı olarak artırır. Oyun sonunda tek atmak ve kartopu etkisi yakalamak içindir."
  },
  conqueror: { 
    name: "Yenilmez", 
    icon: "Precision/Conqueror/Conqueror.png", 
    path: "İsabet",
    description: "Rakip şampiyonlara yapılan saldırı veya yetenek isabetleri değişken kuvvet yükü biriktirir (en fazla 12 yük). Maksimum yüke ulaştığında hasarın bir kısmı kadar can yenileme (mutlak sömürü) sağlar. Uzun savaşan dövüşçüler için harikadır."
  },
  lethalTempo: { 
    name: "Ölümcül Tempo", 
    icon: "Precision/LethalTempo/LethalTempoTemp.png", 
    path: "İsabet",
    description: "Rakiplere yapılan normal saldırılar geçici olarak saldırı hızı yükleri kazandırır (en fazla 6 yük). Maksimum yüke ulaştığında normal saldırı menzilini artırır ve saldırı hızı sınırını aşmanı sağlar. Sürekli normal saldırı yapan nişancılar için biçilmiş kaftandır."
  },
  grasp: { 
    name: "Hortlağın Pençesi", 
    icon: "Resolve/GraspOfTheUndying/GraspOfTheUndying.png", 
    path: "Azim",
    description: "Savaş halindeyken her 4 saniyede bir rakip şampiyona yapacağın bir sonraki normal saldırın; azami canına göre ilave hasar verir, seni iyileştirir ve azami canını kalıcı olarak 5 artırır. Koridorda takas yapmayı seven tanklar için idealdir."
  },
  aftershock: { 
    name: "Artçı Şok", 
    icon: "Resolve/VeteranAftershock/VeteranAftershock.png", 
    path: "Azim",
    description: "Bir rakip şampiyonu hareketsiz bıraktıktan sonra (sersemletme, sabitleme vb.) 2.5 saniyeliğine zırh ve büyü direncini büyük ölçüde artırır, ardından yakınındaki rakiplere büyü hasarı patlaması verir. Takım savaşı başlatan tanklar için en güvenli ründür."
  },
  glacial: { 
    name: "Buzul Takviyesi", 
    icon: "Inspiration/GlacialAugment/GlacialAugment.png", 
    path: "İlham",
    description: "Bir rakip şampiyonu hareketsiz bıraktığında (sersemletme, sabitleme vb.) yerden buzullar çıkararak hedefin ve yakındaki rakiplerin hareket hızını yavaşlatır ve onların takım arkadaşlarına verdiği hasarı azaltır. Kitle kontrollü destek şampiyonları için harikadır."
  },
  firstStrike: { 
    name: "İlk Vuruş", 
    icon: "Inspiration/FirstStrike/FirstStrike.png", 
    path: "İlham",
    description: "Bir rakip şampiyonla çatışmaya ilk giren sen olursan, 3 saniyeliğine %7 ilave hasar verirsin ve verdiğin bu ilave hasar kadar altın kazanırsın. Anlık hasarı yüksek olan ve hızlıca eşya bitirmek isteyen şampiyonlar için mükemmeldir."
  },
  phaseRush: { 
    name: "Sürat Coşkusu", 
    icon: "Sorcery/PhaseRush/PhaseRush.png", 
    path: "Büyücülük",
    description: "Bir rakip şampiyona 4 saniye içinde 3 farklı yetenek veya normal saldırı isabet ettirmek büyük miktarda hareket hızı ve yavaşlatma direnci kazandırır. Pozisyon alması gereken veya vur-kaç yapmak isteyen şampiyonlar için idealdir."
  },
  fleetFootwork: { 
    name: "Ayağı Çabuk", 
    icon: "Precision/FleetFootwork/FleetFootwork.png", 
    path: "İsabet",
    description: "Hareket etmek ve saldırmak enerji yükü biriktirir. 100 yüke ulaştığında yapacağın bir sonraki normal saldırı seni iyileştirir ve kısa süreliğine hareket hızı kazandırır. Koridorda hayatta kalmak ve dürtmelere karşı dayanmak için tercih edilir."
  },
};

// Custom overrides for specific champions to match meta builds perfectly
const CHAMPION_SPECIFIC_BUILDS = {
  Seraphine: {
    // We check if it is Seraphine Support or Seraphine Mid/APC
    getBuild: (lane) => {
      if (lane === "Support" || lane === "Destek") {
        return {
          skillMaxOrder: "Q ➔ E ➔ W",
          skillMaxReason: "Support Seraphine olarak koridorda dürtme hasarını yüksek tutmak için Q yeteneğini ilk maxlıyoruz. Ardından rakipleri yavaşlatmak ve sabitlemek için E yeteneğini, takım arkadaşlarını korumak içinse W yeteneğini geliştiriyoruz.",
          runes: RUNES.aery,
          starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
          core: [ITEMS.moonstoneRenewer, ITEMS.shurelyasBattlesong, ITEMS.ionianBoots],
          situational: [ITEMS.redemption, ITEMS.ardentCenser, ITEMS.flowingWaterStaff, ITEMS.dawncore],
        };
      } else {
        // APC or Mid Build
        return {
          skillMaxOrder: "Q ➔ E ➔ W",
          skillMaxReason: "Taşıyıcı Seraphine oynarken minyon dalgalarını hızlıca temizlemek ve yüksek alan hasarı vurmak adına Q yeteneğini ilk olarak fullemeniz gerekir. Takip eden yetenek olarak kitle kontrolü için E yeteneğini maxlıyoruz.",
          runes: RUNES.comet,
          starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
          core: [ITEMS.archangelsStaff, ITEMS.ludensCompanion, ITEMS.sorcerersShoes],
          situational: [ITEMS.shadowflame, ITEMS.rylai, ITEMS.rabadonsDeathcap, ITEMS.zhonyasHourglass],
        };
      }
    }
  },
  Yasuo: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ E ➔ W",
      skillMaxReason: "Yasuo'nun ana hasar yeteneği Q (Çelik Fırtına) olduğu için ilk olarak fullemeliyiz. Ardından rakiplerin arasında rahatça kaymak ve hareketlilik elde etmek için E yeteneği maxlanır.",
      runes: RUNES.conqueror,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.krakenSlayer, ITEMS.infinityEdge, ITEMS.berserkersGreaves],
      situational: [ITEMS.collector, ITEMS.bloodthirster, ITEMS.steraksGage, ITEMS.guardianAngel],
    })
  },
  Yone: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ E ➔ W",
      skillMaxReason: "Tıpkı Yasuo gibi Yone de Q (Ölümcül Çelik) yeteneğine hasar ve bekleme süresi açısından bağımlıdır, bu yüzden ilk Q fullemeliyiz. Sonrasında E (Özgür Ruh) yeteneğinin hasar biriktirme potansiyelini artırmak için E maxlıyoruz.",
      runes: RUNES.conqueror,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.krakenSlayer, ITEMS.infinityEdge, ITEMS.berserkersGreaves],
      situational: [ITEMS.sundererSky, ITEMS.bloodthirster, ITEMS.steraksGage, ITEMS.guardianAngel],
    })
  },
  Ezreal: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ E ➔ W",
      skillMaxReason: "Ezreal'ın neredeyse tüm hasarı Q (Gizemli Atış) yeteneğine dayalıdır. Bu yüzden ilk Q fullemek zorunludur.  Ardından kaçış ve güvenli pozisyon alma için E yeteneği maxlanır.",
      runes: RUNES.firstStrike,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.trinityForce, ITEMS.archangelsStaff, ITEMS.ionianBoots],
      situational: [ITEMS.collector, ITEMS.lordDominiks, ITEMS.bloodthirster, ITEMS.guardianAngel],
    })
  },
  Lux: {
    getBuild: (lane) => {
      if (lane === "Support" || lane === "Destek") {
        return {
          skillMaxOrder: "E ➔ Q ➔ W",
          skillMaxReason: "Support Lux olarak koridorda dürterek baskı kurmak için E yeteneğini ilk maxlıyoruz. Ardından sabitleme süresi ve hasarı için Q yeteneğini, kalkan gücü içinse W yeteneğini geliştiriyoruz.",
          runes: RUNES.comet,
          starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
          core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
          situational: [ITEMS.rylai, ITEMS.morellonomicon, ITEMS.cryptbloom, ITEMS.rabadonsDeathcap],
        };
      } else {
        return {
          skillMaxOrder: "E ➔ Q ➔ W",
          skillMaxReason: "Orta Koridor Lux oynarken minyon dalgalarını temizlemek ve uzaktan dürtmek için E yeteneği ilk maxlanır. Ardından anlık hasarı tamamlamak için Q yeteneği ful seviyeye getirilir.",
          runes: RUNES.firstStrike,
          starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
          core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
          situational: [ITEMS.rabadonsDeathcap, ITEMS.cryptbloom, ITEMS.zhonyasHourglass, ITEMS.morellonomicon],
        };
      }
    }
  },
  Garen: {
    getBuild: () => ({
      skillMaxOrder: "E ➔ Q ➔ W",
      skillMaxReason: "Garen'in ana minyon biçme ve hasar kaynağı E (Yargı) yeteneğidir. Hızlı takaslar ve dalga temizliği için E ilk maxlanır. Koşma hızı ve anlık hasar içinse Q yeteneği ikinci sırada ful seviyeye ulaştırılır.",
      runes: RUNES.phaseRush,
      starters: [ITEMS.doransShield, ITEMS.healthPotion],
      core: [ITEMS.trinityForce, ITEMS.phantomDancer, ITEMS.platedSteelcaps],
      situational: [ITEMS.steraksGage, ITEMS.deathsDance, ITEMS.deadmansPlate, ITEMS.randuinsOmen],
    })
  },
  Mel: {
    getBuild: (lane) => {
      if (lane === "Support" || lane === "Destek") {
        return {
          skillMaxOrder: "Q ➔ E ➔ W",
          skillMaxReason: "Destek Mel oynarken koridorda rakipleri dürtmek ve alan kontrolü sağlamak için Q yeteneğini ilk maxlıyoruz. Rakipleri sabitlemek ve yavaşlatmak için E yeteneğini ikinci olarak ful seviyeye getirmeliyiz. W yeteneği ise kalkan ve direnç sağladığı için en son maxlanır.",
          runes: RUNES.comet,
          starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
          core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
          situational: [ITEMS.morellonomicon, ITEMS.cryptbloom, ITEMS.zhonyasHourglass, ITEMS.rabadonsDeathcap],
        };
      } else {
        return {
          skillMaxOrder: "Q ➔ E ➔ W",
          skillMaxReason: "Orta Koridor Mel oynarken minyon dalgalarını hızlıca temizlemek ve rakibi yüksek hasarla dürtmek için Q yeteneğini ilk maxlıyoruz. Ardından anlık hasarı artırmak ve rakipleri yakalamak için E yeteneğini son seviyeye getirmeliyiz.",
          runes: RUNES.firstStrike,
          starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
          core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
          situational: [ITEMS.rabadonsDeathcap, ITEMS.cryptbloom, ITEMS.zhonyasHourglass, ITEMS.morellonomicon],
        };
      }
    }
  },
  Ahri: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ W ➔ E",
      skillMaxReason: "Ahri'nin ana minyon temizleme ve dürtme gücü Q (Aldatan Küre) yeteneğidir, bu yüzden ilk fullemeliyiz. Ardından çatışmalarda hedefleri takip etmek ve hasar vermek için W yeteneği maxlanır.",
      runes: RUNES.electrocute,
      starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
      core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
      situational: [ITEMS.rabadonsDeathcap, ITEMS.zhonyasHourglass, ITEMS.cryptbloom, ITEMS.lichBane],
    })
  },
  Zed: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ E ➔ W",
      skillMaxReason: "Zed'in uzaktan dürtme ve enerji yenilemeli hasarı Q (Keskin Gölge) yeteneğidir. İlk Q fulledikten sonra alan hasarı ve yavaşlatma için E yeteneği max seviyeye getirilir.",
      runes: RUNES.electrocute,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.hubris, ITEMS.opportunity, ITEMS.ionianBoots],
      situational: [ITEMS.youmuus, ITEMS.edgeOfNight, ITEMS.seryldasGrudge, ITEMS.profaneHydra],
    })
  },
  Aatrox: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ E ➔ W",
      skillMaxReason: "Aatrox'un tüm oynanışı Q (Darkin Kılıcı) vuruşlarına bağlıdır, bu yüzden ilk Q fullemek mecburidir. Grid sistemde can yenilemek ve mobil olmak için E yeteneği ikinci maxlanır.",
      runes: RUNES.conqueror,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.eclipse, ITEMS.sundererSky, ITEMS.platedSteelcaps],
      situational: [ITEMS.blackCleaver, ITEMS.steraksGage, ITEMS.deathsDance, ITEMS.ravenousHydra],
    })
  },
  Jinx: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ W ➔ E",
      skillMaxReason: "Jinx'in roketatar/taramalı saldırı menzil ve hız artışını elde etmek için Q (Değiştir!) ilk maxlanmalıdır. Ardından uzaktan dürtmek ve rakipleri yavaşlatmak için W yeteneği geliştirilir.",
      runes: RUNES.lethalTempo,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.krakenSlayer, ITEMS.infinityEdge, ITEMS.berserkersGreaves],
      situational: [ITEMS.phantomDancer, ITEMS.bloodthirster, ITEMS.lordDominiks, ITEMS.guardianAngel],
    })
  },
  LeeSin: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ W ➔ E",
      skillMaxReason: "Lee Sin'in orman temizleme, düello hasarı ve baskın gücü Q (Ses Dalgası) yeteneğine bağlıdır. İkinci olarak hayatta kalma kalkanı ve can çalma sağlamak için W yeteneği maxlanır.",
      runes: RUNES.conqueror,
      starters: [ITEMS.scorchclawPup, ITEMS.healthPotion],
      core: [ITEMS.eclipse, ITEMS.sundererSky, ITEMS.platedSteelcaps],
      situational: [ITEMS.blackCleaver, ITEMS.steraksGage, ITEMS.deathsDance, ITEMS.guardianAngel],
    })
  },
  Katarina: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ E ➔ W",
      skillMaxReason: "Katarina ile koridor aşamasında minyon biçmek ve hançer bırakıp hasar takaslarına girmek için ilk Q maxlıyoruz. Takip eden hasar potansiyeli ve ani sıçrama için E yeteneği maxlanır.",
      runes: RUNES.electrocute,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.lichBane, ITEMS.shadowflame, ITEMS.sorcerersShoes],
      situational: [ITEMS.rabadonsDeathcap, ITEMS.zhonyasHourglass, ITEMS.cryptbloom, ITEMS.voidStaff],
    })
  },
  Brand: {
    getBuild: (lane) => {
      const isSupport = lane === "Support" || lane === "Destek";
      const isJungle = lane === "Jungle" || lane === "Orman";
      return {
        skillMaxOrder: "W ➔ Q ➔ E",
        skillMaxReason: "Brand'in ana alan hasarı ve minyon temizleme yeteneği W (Alev Sütunu) olduğu için ilk maxlanır. Sersemletme süresi ve anlık kombo hasarı için ikinci olarak Q maxlanır.",
        runes: RUNES.comet,
        starters: [isSupport ? ITEMS.worldAtlas : (isJungle ? ITEMS.scorchclawPup : ITEMS.doransRing), ITEMS.healthPotion],
        core: [ITEMS.liandrysTorment, ITEMS.rylai, ITEMS.sorcerersShoes],
        situational: [ITEMS.shadowflame, ITEMS.rabadonsDeathcap, ITEMS.morellonomicon, ITEMS.cryptbloom],
      };
    }
  },
  Diana: {
    getBuild: (lane) => {
      const isJungle = lane === "Jungle" || lane === "Orman";
      return {
        skillMaxOrder: "Q ➔ W ➔ E",
        skillMaxReason: "Diana'nın dürtme ve hançer hasarı Q (Hilal Darbesi) yeteneğidir ve ilk maxlanmalıdır. Kampları temizlerken/savaşırken hayatta kalmak ve kalkan elde etmek için W yeteneği ikinci sırada maxlanır.",
        runes: RUNES.conqueror,
        starters: [isJungle ? ITEMS.scorchclawPup : ITEMS.doransRing, ITEMS.healthPotion],
        core: [ITEMS.lichBane, ITEMS.shadowflame, ITEMS.sorcerersShoes],
        situational: [ITEMS.zhonyasHourglass, ITEMS.rabadonsDeathcap, ITEMS.cryptbloom, ITEMS.voidStaff],
      };
    }
  },
  Thresh: {
    getBuild: () => ({
      skillMaxOrder: "Q ➔ W ➔ E",
      skillMaxReason: "Thresh ile savaş başlatmak ve rakip yakalamak için Q (Ölüm Cezası) bekleme süresini azaltmak adına ilk maxlanır. Takım arkadaşlarını korumak ve güvenliğe çekmek için fener (W) yeteneği ikinci sırada ful seviyeye getirilir.",
      runes: RUNES.aftershock,
      starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
      core: [ITEMS.locketSolari, ITEMS.knightsVow, ITEMS.platedSteelcaps],
      situational: [ITEMS.zekesConvergence, ITEMS.thornmail, ITEMS.trailblazer, ITEMS.warmogsArmor],
    })
  },
  Teemo: {
    getBuild: () => ({
      skillMaxOrder: "E ➔ Q ➔ W",
      skillMaxReason: "Teemo'nun rakipleri normal vuruşlarıyla zehirlemesi E (Zehirli Atış) yeteneğine bağlıdır. Koridorda maksimum dürtme hasarı için ilk E maxlanır, rakipleri kör etmek için ise Q yeteneği ikinci max seviyeye çıkarılır.",
      runes: RUNES.firstStrike,
      starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
      core: [ITEMS.liandrysTorment, ITEMS.shadowflame, ITEMS.sorcerersShoes],
      situational: [ITEMS.rabadonsDeathcap, ITEMS.rylai, ITEMS.morellonomicon, ITEMS.zhonyasHourglass],
    })
  }
};

// Generic builders based on champion classes/lanes
export function getBuildRecommendation(champion, selectedLane) {
  const champId = champion.id;
  const tags = champion.tags || [];
  const lanes = champion.lanes || [];
  
  // Resolve active lane
  const activeLane = selectedLane || lanes[0] || "Mid";

  // Check for exact override first
  if (CHAMPION_SPECIFIC_BUILDS[champId]) {
    const override = CHAMPION_SPECIFIC_BUILDS[champId];
    return override.getBuild ? override.getBuild(activeLane) : override;
  }

  // 1. Support Lane
  if (activeLane === "Support" || activeLane === "Destek") {
    if (tags.includes("Tank")) {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Tank ve kitle kontrolü yüksek bir destek olarak, takım savaşları başlatmak için ana sersemletme/yakalama yeteneğinizi (Q) ilk maxlayın. Ardından tanklığınızı artırmak için dirençlerinizi (W) geliştirin.",
        runes: RUNES.aftershock,
        starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
        core: [ITEMS.locketSolari, ITEMS.knightsVow, ITEMS.platedSteelcaps],
        situational: [ITEMS.thornmail, ITEMS.zekesConvergence, ITEMS.warmogsArmor, ITEMS.trailblazer],
      };
    } else if (tags.includes("Mage")) {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Destek rolünde rakipleri dürterek baskı kurmak ve minyon ittirmek için dürtme yeteneğinizi ilk maxlayın. Takım arkadaşlarınızı korumak adına kalkan veya kontrol yeteneklerini ikinci sıraya koyun.",
        runes: RUNES.comet,
        starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
        core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
        situational: [ITEMS.rylai, ITEMS.morellonomicon, ITEMS.cryptbloom, ITEMS.rabadonsDeathcap],
      };
    } else {
      return {
        skillMaxOrder: "E ➔ W ➔ Q",
        skillMaxReason: "Takım arkadaşlarınızı iyileştiren veya kalkan veren ana koruma yeteneğinizi ilk maxlayın. İkinci olarak hareket hızı veya kontrol sağlayan yeteneğinizi geliştirin.",
        runes: RUNES.aery,
        starters: [ITEMS.worldAtlas, ITEMS.healthPotion, ITEMS.healthPotion],
        core: [ITEMS.moonstoneRenewer, ITEMS.shurelyasBattlesong, ITEMS.ionianBoots],
        situational: [ITEMS.redemption, ITEMS.ardentCenser, ITEMS.flowingWaterStaff, ITEMS.dawncore],
      };
    }
  }

  // 2. Jungle Lane
  if (activeLane === "Jungle" || activeLane === "Orman") {
    if (tags.includes("Mage") || (tags.includes("Assassin") && champion.info.magic > champion.info.attack)) {
      return {
        skillMaxOrder: "Q ➔ W ➔ E",
        skillMaxReason: "AP Ormancı olarak kampları hızlı temizlemek ve baskınlarda yüksek anlık hasar çıkarmak için ana hasar yeteneğinizi ilk maxlayın. Bekleme süresi düşük olan yetenekleri önceliklendirin.",
        runes: RUNES.darkHarvest,
        starters: [ITEMS.scorchclawPup, ITEMS.healthPotion],
        core: [ITEMS.liandrysTorment, ITEMS.shadowflame, ITEMS.sorcerersShoes],
        situational: [ITEMS.ludensCompanion, ITEMS.zhonyasHourglass, ITEMS.rabadonsDeathcap, ITEMS.cryptbloom],
      };
    } else if (tags.includes("Tank")) {
      return {
        skillMaxOrder: "W ➔ E ➔ Q",
        skillMaxReason: "Tank ormancı olarak orman kamplarını alan hasarıyla hızlıca temizlemek için W yeteneğinizi ilk maxlayın. Ardından baskınlarda rakipleri uzun süre sabitlemek için kitle kontrolü yeteneğinizi geliştirin.",
        runes: RUNES.aftershock,
        starters: [ITEMS.mosstomperSeedling, ITEMS.healthPotion],
        core: [ITEMS.sunfireAegis, ITEMS.jaksho, ITEMS.platedSteelcaps],
        situational: [ITEMS.thornmail, ITEMS.kaenicRookern, ITEMS.frozenHeart, ITEMS.warmogsArmor],
      };
    } else if (tags.includes("Assassin")) {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Suikastçı olarak kampları tekli hasarla eritmek ve baskınlarda ani skorlar almak için Q hasar yeteneğinizi ilk maxlayın. Hareketliliğinizi artıran veya görünmezlik yeteneğinizi ikinci sıraya koyun.",
        runes: RUNES.electrocute,
        starters: [ITEMS.gustwalkerHatchling, ITEMS.healthPotion],
        core: [ITEMS.hubris, ITEMS.opportunity, ITEMS.ionianBoots],
        situational: [ITEMS.youmuus, ITEMS.edgeOfNight, ITEMS.seryldasGrudge, ITEMS.profaneHydra],
      };
    } else {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Dövüşçü ormancı olarak düellolarda ve orman temizliğinde bekleme süresi kısa, hasarı yüksek ana yeteneğinizi (genellikle Q) ilk maxlayın. Hareket kabiliyetinizi artırmak için mobil yetenekleri ikinci sırada geliştirin.",
        runes: RUNES.conqueror,
        starters: [ITEMS.scorchclawPup, ITEMS.healthPotion],
        core: [ITEMS.trinityForce, ITEMS.sundererSky, ITEMS.platedSteelcaps],
        situational: [ITEMS.blackCleaver, ITEMS.steraksGage, ITEMS.deathsDance, ITEMS.mercurysTreads],
      };
    }
  }

  // 3. Bot Lane (ADC)
  if (activeLane === "Bot" || tags.includes("Marksman")) {
    return {
      skillMaxOrder: "Q ➔ W ➔ E",
      skillMaxReason: "Nişancılar genellikle koridorda minyon biçme ve takas gücünü artırmak için en yüksek hasar çarpanına sahip ana yeteneğini (Q) ilk maxlarlar. Hayatta kalma veya hareketlilik yeteneklerine ikinci sırada puan verirler.",
      runes: RUNES.lethalTempo,
      starters: [ITEMS.doransBlade, ITEMS.healthPotion],
      core: [ITEMS.krakenSlayer, ITEMS.infinityEdge, ITEMS.berserkersGreaves],
      situational: [ITEMS.collector, ITEMS.bloodthirster, ITEMS.lordDominiks, ITEMS.guardianAngel],
    };
  }

  // 4. Mid Lane
  if (activeLane === "Mid") {
    if (tags.includes("Assassin")) {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Orta koridor suikastçısı olarak anlık hasarınızı maksimize etmek ve rakip taşıyıcıları anında eritmek için temel hasar yeteneğinizi (Q) ilk maxlayın. Kaçış ve konumlanma yeteneğini ikinci sıraya alın.",
        runes: RUNES.electrocute,
        starters: [ITEMS.doransBlade, ITEMS.healthPotion],
        core: [ITEMS.hubris, ITEMS.opportunity, ITEMS.ionianBoots],
        situational: [ITEMS.youmuus, ITEMS.edgeOfNight, ITEMS.seryldasGrudge, ITEMS.profaneHydra],
      };
    } else {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Orta koridor büyücüsü olarak koridor ittirme ve rakipleri uzaktan dürterek baskı altında tutma potansiyelinizi yükseltmek adına ana yeteneğinizi ilk maxlayın. Alan kontrolü veya sabitleme yeteneklerinizi ikinci sıraya alın.",
        runes: RUNES.comet,
        starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
        core: [ITEMS.ludensCompanion, ITEMS.shadowflame, ITEMS.sorcerersShoes],
        situational: [ITEMS.rabadonsDeathcap, ITEMS.cryptbloom, ITEMS.zhonyasHourglass, ITEMS.morellonomicon],
      };
    }
  }

  // 5. Top Lane
  if (activeLane === "Top") {
    if (tags.includes("Tank")) {
      return {
        skillMaxOrder: "Q ➔ W ➔ E",
        skillMaxReason: "Tank olarak koridor aşamasında hasar takaslarında geri düşmemek ve minyon biçmek için temel hasar yeteneğinizi ilk fulleyin. Hayatta kalmak için kalkan/direnç yeteneğinizi (W) ikinci sırada geliştirin.",
        runes: RUNES.grasp,
        starters: [ITEMS.doransShield, ITEMS.healthPotion],
        core: [ITEMS.sunfireAegis, ITEMS.jaksho, ITEMS.platedSteelcaps],
        situational: [ITEMS.thornmail, ITEMS.kaenicRookern, ITEMS.frozenHeart, ITEMS.warmogsArmor],
      };
    } else if (tags.includes("Mage")) {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Üst koridor büyücüsü olarak düello gücünüzü ve uzaktan dürterek koridor kontrolünü yüksek tutmak için ana yeteneğinizi ilk maxlayın. Kaçış yeteneklerine ikinci sırada puan verin.",
        runes: RUNES.fleetFootwork,
        starters: [ITEMS.doransRing, ITEMS.healthPotion, ITEMS.healthPotion],
        core: [ITEMS.liandrysTorment, ITEMS.shadowflame, ITEMS.sorcerersShoes],
        situational: [ITEMS.rabadonsDeathcap, ITEMS.cryptbloom, ITEMS.zhonyasHourglass, ITEMS.morellonomicon],
      };
    } else {
      return {
        skillMaxOrder: "Q ➔ E ➔ W",
        skillMaxReason: "Üst koridor dövüşçüsü olarak yakın dövüşte sürekli hasar çıkarabilmek ve düelloları kazanmak adına bekleme süresi kısa ana vuruş yeteneğinizi (Q) ilk maxlayın. Defansif veya hareket yeteneğini ikinci sıraya alın.",
        runes: RUNES.conqueror,
        starters: [ITEMS.doransBlade, ITEMS.healthPotion],
        core: [ITEMS.trinityForce, ITEMS.sundererSky, ITEMS.platedSteelcaps],
        situational: [ITEMS.blackCleaver, ITEMS.steraksGage, ITEMS.deathsDance, ITEMS.mercurysTreads],
      };
    }
  }

  // 6. Generic Fallback
  return {
    skillMaxOrder: "Q ➔ E ➔ W",
    skillMaxReason: "Dövüşçüler yakın dövüşte sürekli hasar çıkarabilmek adına en kısa bekleme süresine sahip ana vuruş yeteneklerini (Q) ilk maxlarlar. Sonrasında takas gücü için E veya W geliştirilir.",
    runes: RUNES.conqueror,
    starters: [ITEMS.doransBlade, ITEMS.healthPotion],
    core: [ITEMS.trinityForce, ITEMS.sundererSky, ITEMS.platedSteelcaps],
    situational: [ITEMS.blackCleaver, ITEMS.steraksGage, ITEMS.deathsDance, ITEMS.mercurysTreads],
  };
}
