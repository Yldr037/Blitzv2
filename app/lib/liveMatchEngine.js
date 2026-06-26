// League of Legends Match Analysis & Counter Recommendation Engine

// List of champions that have high self-healing or team-healing capabilities
export const HEAL_CHAMPIONS = new Set([
  "Aatrox", "Briar", "DrMundo", "Dr. Mundo", "Fiddlesticks", "Illaoi", "Irelia", "Kayn", 
  "Nami", "Olaf", "Renekton", "Senna", "Sona", "Soraka", "Swain", "Sylas", "Taric", 
  "Trundle", "Vladimir", "Volibear", "Warwick", "Yuumi", "Zac", "Darius", "Hecarim", "Mundo"
]);

// List of champions with high burst/one-shot potential (Assassins and Burst Mages)
export const BURST_CHAMPIONS = new Set([
  "Akali", "Diana", "Ekko", "Evelynn", "Fizz", "Kassadin", "Katarina", "KhaZix", "Khazix",
  "Leblanc", "LeBlanc", "Naafiri", "Nocturne", "Pyke", "Qiyana", "Rengar", "Shaco", "Syndra", 
  "Talon", "Veigar", "Zed", "Zoe", "MasterYi", "Master Yi"
]);

// List of champions with heavy/reliable Crowd Control (CC)
export const CC_CHAMPIONS = new Set([
  "Alistar", "Amumu", "Ashe", "Bard", "Blitzcrank", "Braum", "Galio", "Gragas", "Leona", 
  "Lissandra", "Lux", "Malzahar", "Maokai", "Morgana", "Nautilus", "Pyke", "Rell", "Sejuani", 
  "Skarner", "Thresh", "Veigar", "Zac", "Zyra", "Seraphine", "Syndra", "Jax"
]);

// Helper to determine primary damage type of an enemy champion
export function getChampionDamageType(champion) {
  const name = champion.id || champion.name;
  
  // Explicit AP champions (mages, magic-based tanks/assassins)
  const apChampions = new Set([
    "Ahri", "Akali", "Amumu", "Anivia", "Annie", "AurelionSol", "Azir", "Bard", "Brand", 
    "Cassiopeia", "ChoGath", "Diana", "Ekko", "Elise", "Evelynn", "Fiddlesticks", "Fizz", 
    "Galio", "Gragas", "Gwen", "Heimerdinger", "Ivern", "Janna", "Karma", "Kassadin", 
    "Katarina", "Kennen", "Leblanc", "Lillia", "Lissandra", "Lulu", "Lux", "Malphite", 
    "Malzahar", "Maokai", "Milio", "Mordekaiser", "Morgana", "Nami", "Neeko", "Nidalee", 
    "Nunu", "Orianna", "Rumble", "Ryze", "Singed", "Sona", "Soraka", "Swain", "Syndra", 
    "TahmKench", "Taliyah", "Teemo", "TwistedFate", "Veigar", "VelKoz", "Vex", "Viktor", 
    "Vladimir", "Xerath", "Yuumi", "Zac", "Ziggs", "Zilean", "Zoe", "Zyra", "Seraphine", "Renata"
  ]);

  if (apChampions.has(name)) return "AP";
  
  // Mixed damage champions
  const mixedChampions = new Set([
    "DrMundo", "Dr. Mundo", "Ezreal", "Katarina", "Kayle", "KogMaw", "Kog'Maw", "Ornn", 
    "Shaco", "Udyr", "Varus", "Volibear", "Warwick", "Yone", "Jax", "Senna"
  ]);
  
  if (mixedChampions.has(name)) return "Karma";
  
  // Check tags as fallback
  if (champion.tags?.includes("Mage")) return "AP";

  return "AD";
}

// Maps specific counter categories to item candidates (ID, Name, Cost)
const COUNTER_MAP = {
  AP: [
    { id: 2504, name: "Kutluyas Rukern", cost: 2900 },
    { id: 3156, name: "Malmortius'un Ağzı", cost: 2800 },
    { id: 3091, name: "Aklın Sonu", cost: 2800 },
    { id: 3102, name: "Banshee'ın Duvağı", cost: 3100 },
    { id: 3065, name: "Ruh Gömleği", cost: 2800 },
    { id: 6664, name: "Donuk Işıltı", cost: 2800 },
    { id: 3111, name: "Merkür'ün Adımları", cost: 1200 }
  ],
  AD: [
    { id: 3157, name: "Zhonya'nın Kumsaati", cost: 3250 },
    { id: 3010, name: "Ölümün Dansı", cost: 3200 },
    { id: 3026, name: "Koruyucu Melek", cost: 3000 },
    { id: 3143, name: "Randuin'in Alameti", cost: 2700 },
    { id: 3110, name: "Donmuş Yürek", cost: 2300 },
    { id: 3075, name: "Çivili Zırh", cost: 2700 },
    { id: 3742, name: "Ölü Adamın Zırhı", cost: 2900 },
    { id: 3047, name: "Çelik Kaplamalı Çizme", cost: 1000 }
  ],
  HEAL: [
    { id: 3165, name: "Morellonomikon", cost: 2200 },
    { id: 3033, name: "Ölüm Hatırası", cost: 3000 },
    { id: 3075, name: "Çivili Zırh", cost: 2700 },
    { id: 6609, name: "Kimyasal Kimya-Pala", cost: 2200 }
  ],
  TANK: [
    { id: 3036, name: "Dominik Efendi'nin Hürmeti", cost: 3000 },
    { id: 3071, name: "Kara Balta", cost: 3000 },
    { id: 3135, name: "Boşluk Değneği", cost: 3000 },
    { id: 3137, name: "Kriptoçiçek", cost: 2850 },
    { id: 3302, name: "Terminus", cost: 3000 },
    { id: 3035, name: "Serylda'nın Garezi", cost: 3200 }
  ],
  BURST: [
    { id: 3053, name: "Sterak'ın Güvencesi", cost: 3000 },
    { id: 3157, name: "Zhonya'nın Kumsaati", cost: 3250 },
    { id: 3026, name: "Koruyucu Melek", cost: 3000 },
    { id: 2504, name: "Kutluyas Rukern", cost: 2900 },
    { id: 3102, name: "Banshee'ın Duvağı", cost: 3100 },
    { id: 3010, name: "Ölümün Dansı", cost: 3200 }
  ],
  CC: [
    { id: 3111, name: "Merkür'ün Adımları", cost: 1200 }
  ]
};

// Returns a counter item only if it is present in the Mobalytics build's situational/full build list
function findMobaCounterItem(category, resolvedBuild) {
  if (!resolvedBuild) return null;
  const mobaSituationalIds = new Set(resolvedBuild.situational?.map(item => Number(item.id)) || []);
  const candidates = COUNTER_MAP[category] || [];
  
  for (const candidate of candidates) {
    if (mobaSituationalIds.has(candidate.id)) {
      return {
        id: candidate.id.toString(),
        name: candidate.name,
        cost: candidate.cost
      };
    }
  }
  return null;
}

// Recommends situational items based on enemy composition, strictly matching Mobalytics build suggestions
export function getSituationalRecommendations(enemies, myChampion, myRole, resolvedBuild = null) {
  const recommendations = [];
  
  if (!enemies || enemies.length === 0 || !resolvedBuild) return recommendations;

  // Calculate enemy team stats
  let apCount = 0;
  let adCount = 0;
  let healerCount = 0;
  let burstCount = 0;
  let ccCount = 0;
  let tankCount = 0;

  const apNames = [];
  const adNames = [];
  const healerNames = [];
  const burstNames = [];
  const ccNames = [];
  const tankNames = [];

  enemies.forEach(enemy => {
    if (!enemy) return;
    const name = enemy.name;
    const dmgType = getChampionDamageType(enemy);

    if (dmgType === "AP") {
      apCount++;
      apNames.push(name);
    } else if (dmgType === "AD") {
      adCount++;
      adNames.push(name);
    } else {
      apCount += 0.5;
      adCount += 0.5;
    }

    if (HEAL_CHAMPIONS.has(enemy.id) || HEAL_CHAMPIONS.has(enemy.name)) {
      healerCount++;
      healerNames.push(name);
    }
    if (BURST_CHAMPIONS.has(enemy.id) || BURST_CHAMPIONS.has(enemy.name)) {
      burstCount++;
      burstNames.push(name);
    }
    if (CC_CHAMPIONS.has(enemy.id) || CC_CHAMPIONS.has(enemy.name)) {
      ccCount++;
      ccNames.push(name);
    }
    if (enemy.tags?.includes("Tank") || enemy.tags?.includes("Fighter") && enemy.info?.defense >= 6) {
      tankCount++;
      tankNames.push(name);
    }
  });

  // 1. Anti-AP (Magic Resist)
  if (apCount >= 2.5) {
    const listAp = apNames.slice(0, 3).join(", ");
    const match = findMobaCounterItem("AP", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `Rakip takımda yüksek büyü hasarı (${listAp}) bulunduğu için büyü direnci ve koruma sağlar.`
      });
    }
  }

  // 2. Anti-AD / Anti-Crit
  if (adCount >= 2.5) {
    const listAd = adNames.slice(0, 3).join(", ");
    const match = findMobaCounterItem("AD", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `Rakip fiziksel hasar taşıyıcılarına (${listAd}) karşı zırh ve hayatta kalma avantajı sağlar.`
      });
    }
  }

  // 3. Anti-Healing (Ağır Yara)
  if (healerCount >= 1) {
    const listHealer = healerNames.join(", ");
    const match = findMobaCounterItem("HEAL", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `Rakipte yüksek iyileşme/yenilenme gücüne sahip şampiyonlar (${listHealer}) var. Hasar verdiğinde onların iyileştirme etkilerini %40 azaltır.`
      });
    }
  }

  // 4. Anti-Tank (Penetration / Yüzdesel Hasar)
  if (tankCount >= 2) {
    const listTanks = tankNames.slice(0, 2).join(", ");
    const match = findMobaCounterItem("TANK", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `Rakip ön saflardaki tankların (${listTanks}) yüksek zırh/dirençlerini aşarak hasarını maksimize eder.`
      });
    }
  }

  // 5. Anti-Burst / Anti-Assassin
  if (burstCount >= 2) {
    const listBurst = burstNames.slice(0, 2).join(", ");
    const match = findMobaCounterItem("BURST", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `Rakip suikastçıların/anlık hasar kaynaklarının (${listBurst}) seni tekte eritmesini engellemek için koruma sağlar.`
      });
    }
  }

  // 6. Anti-CC / Slow
  if (ccCount >= 2) {
    const listCc = ccNames.slice(0, 3).join(", ");
    const match = findMobaCounterItem("CC", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `Rakipte yoğun kitle kontrolü (${listCc}) bulunuyor. Sıvışma özelliği vererek sersemletme, yavaşlatma sürelerini %30 azaltır.`
      });
    }
  }

  // Deduplicate recommendations by item ID
  const seenIds = new Set();
  return recommendations.filter(rec => {
    if (seenIds.has(rec.id)) return false;
    seenIds.add(rec.id);
    return true;
  });
}

// Localized matchup tips database
const CHAMPION_TIPS = {
  Zed: [
    "Zed ultisini (Ölüm İşareti) attığında doğrudan arkanda belirir. Tam o anda arkana yetenek atarak onu sersemletebilir veya hasar verebilirsin.",
    "Zhonya'nın Kumsaati veya Kronometre, Zed'in ulti hasar patlamasını tamamen boşa çıkarır.",
    "Gölgesi (W) bekleme süresindeyken (yaklaşık 20 saniye) oldukça savunmasızdır. Bu pencerede üstüne oyna."
  ],
  Yasuo: [
    "Rüzgar Duvarı (W) yeteneğinin bekleme süresi çok uzundur (26-30 saniye). Önemli yeteneklerini yutmadan önce bu yeteneği harcatmaya zorla.",
    "Pasif kalkanını koridorda düz bir vuruşla bozduktan sonra asıl yeteneklerini kullan.",
    "Kendi minyonlarının yakınındayken Yasuo'nun E yeteneğiyle çok hızlı kayabileceğini unutma, minyonlardan uzak durmaya çalış."
  ],
  Soraka: [
    "Soraka takımını arkadan sürekli iyileştirir. Takım savaşlarında ilk olarak Soraka'yı hedef almaya çalışmalısınız.",
    "Ağır Yara (Morellonomikon, Çivili Zırh, Ölüm Hatırası) eşyalarını erken satın almak Soraka'nın tüm etkisini sıfırlar.",
    "Q (Yıldız Yağmuru) yeteneğinden kaçınmak, onun can yenilemesini ve ekstra hız kazanmasını engeller."
  ],
  Aatrox: [
    "Aatrox'un Q yeteneğinin tatlı noktalarından (kırmızı bölgeler) kaçının. İçeride kalırsanız zıplatır ve daha fazla vurur.",
    "İyileşme gücünü azaltmak için Ağır Yara eşyası (Thornmail, Mortal Reminder vb.) almak zorunludur.",
    "Ultisini bastığında geri çekilip ulti süresinin (10 saniye) bitmesini beklemek savaş kazanma şansını çok arttırır."
  ],
  Blitzcrank: [
    "Her zaman minyon dalgasının arkasında durmaya özen gösterin, böylece Q (Roket El) yeteneğiyle sizi çekemez.",
    "Q yeteneğini kaçırdığında Blitzcrank yaklaşık 15-20 saniye boyunca etkisiz kalır. Bu sürede koridorda baskı kurun.",
    "Pasif kalkanı canı azaldığında devreye girer. Kalkan aktifken onu hemen kesmeye çalışmak yerine kalkanın sönmesini beklemek gerekebilir."
  ],
  Thresh: [
    "Thresh'in fenerine (W) rakip şampiyonların tıklamasını engellemek için fenerin tam üstüne totem yerleştirebilir veya üstünde durabilirsiniz.",
    "Thresh Q (Ölüm Cezası) atmadan önce zincirini döndürür. Zincirin dönüş yönüne ve Thresh'in baktığı yöne dikkat edin.",
    "E yeteneği (Azap) ile atılmalarını kesebilir (örneğin Lee Sin Q'su). Atılma yeteneklerini Thresh E'sini kullandıktan sonra harcamaya çalış."
  ],
  Morgana: [
    "Kara Kalkan (E) sadece büyü hasarını ve kitle kontrolünü engeller. Fiziksel hasar vurarak kalkanı hızlıca kırabilirsiniz.",
    "Q (Karanlık Esaret) yeteneği yavaş uçan bir mermidir. Sağa veya sola doğru hareket ederek kolayca kaçınabilirsiniz.",
    "Ulti attığında bağları koparmak için Morgana'nın menzilinden hızla uzaklaşın veya onu geriye itin."
  ],
  Yuumi: [
    "Yuumi bir şampiyona yapışıkken hedef alınamaz. Yapıştığı şampiyonu hedef alırken de Ağır Yara eşyası almanız şarttır.",
    "Yuumi pasifini yenilemek için şampiyondan ayrıldığında kitle kontrol yeteneği uygulayarak onun tekrar yapışmasını engelleyin.",
    "Yuumi'nin ultisi (Dalga Dalga) 3 kez isabet ederse sersemletir. Dalgaların yönünden kaçınmak için sağa sola hareket edin."
  ],
  Malphite: [
    "Malphite'ın ultisi (Al堅lmaz Güç) takım savaşlarında belirleyicidir. Takım arkadaşlarınızla yan yana durmayın, ayrık durun.",
    "Büyü hasarı odaklı Malphite'lar AP kasar ve tek atabilir. Büyü kalkanı (Banshee/Rukern) almak sizi kurtaracaktır.",
    "Koridorda pasif kalkanı tazelenmeden önce ona hasar vererek kalkanın yenilenmesini engelleyin."
  ],
  Warwick: [
    "Warwick canı %50'nin altına indiğinde inanılmaz miktarda can çalar. Canı azaldığında onu hafife almayın ve Ağır Yara uygulayın.",
    "Ultisi (Sonsuz Şiddet) bir bastırma yeteneğidir. Cıvalı Yatağan veya takım arkadaşının kitle kontrolü uygulamasıyla iptal edilebilir.",
    "Warwick canı az olan rakiplerin kokusunu alarak (W) haritada çok hızlı koşar. Düşük canla haritada tek başınıza gezmeyin."
  ]
};

// Generates general tactical matchup advice against specific selected enemy champions
export function getMatchupTips(enemies) {
  const tips = [];
  if (!enemies) return tips;

  enemies.forEach(enemy => {
    if (!enemy) return;
    const name = enemy.id || enemy.name;
    if (CHAMPION_TIPS[name]) {
      tips.push({
        championId: enemy.id,
        championName: enemy.name,
        icon: enemy.icon,
        notes: CHAMPION_TIPS[name]
      });
    }
  });

  return tips;
}

// Recommends situational items against a single selected enemy champion, strictly matching Mobalytics build suggestions
export function getSingleEnemyRecommendations(enemy, myChampion, myRole, resolvedBuild = null) {
  const recommendations = [];
  if (!enemy || !resolvedBuild) return recommendations;

  const name = enemy.name;
  const dmgType = getChampionDamageType(enemy);
  const isHealer = HEAL_CHAMPIONS.has(enemy.id) || HEAL_CHAMPIONS.has(enemy.name);
  const isBurst = BURST_CHAMPIONS.has(enemy.id) || BURST_CHAMPIONS.has(enemy.name);
  const isCc = CC_CHAMPIONS.has(enemy.id) || CC_CHAMPIONS.has(enemy.name);
  const isTank = enemy.tags?.includes("Tank") || (enemy.tags?.includes("Fighter") && enemy.info?.defense >= 6);

  // 1. Anti-AP (Magic Resist)
  if (dmgType === "AP") {
    const match = findMobaCounterItem("AP", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `${name} büyü hasarı (AP) odaklı bir şampiyon. Büyü direnci sağlayarak onun hasarından korunmanı sağlar.`
      });
    }
  }

  // 2. Anti-AD / Anti-Crit
  if (dmgType === "AD") {
    const match = findMobaCounterItem("AD", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `${name} fiziksel hasar (AD) odaklı bir şampiyon. Fiziksel hasar ve düz vuruş baskısına karşı koruma sağlar.`
      });
    }
  }

  // 3. Anti-Healing (Ağır Yara)
  if (isHealer) {
    const match = findMobaCounterItem("HEAL", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `${name} yüksek iyileşme/can çalma yeteneğine sahip. Hasar verdiğinde iyileşmesini %40 azaltır.`
      });
    }
  }

  // 4. Anti-Tank (Zırh / Büyü Nüfuzu)
  if (isTank) {
    const match = findMobaCounterItem("TANK", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `${name} yüksek dirençlere sahip bir tank. Zırh/büyü nüfuzu sağlayarak onu eritmeni sağlar.`
      });
    }
  }

  // 5. Anti-Burst (Sterak / Zhonya / GA)
  if (isBurst) {
    const match = findMobaCounterItem("BURST", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `${name} anlık yüksek hasar (burst) potansiyeline sahip. Burst hasarını engellemek veya soğurmak için koruma sağlar.`
      });
    }
  }

  // 6. Anti-CC (Sıvışma / Merkür)
  if (isCc) {
    const match = findMobaCounterItem("CC", resolvedBuild);
    if (match) {
      recommendations.push({
        id: match.id,
        name: match.name,
        cost: match.cost,
        reason: `${name} yüksek kitle kontrolüne sahip. Sıvışma vererek kitle kontrolü sürelerini %30 kısaltır.`
      });
    }
  }

  // Deduplicate
  const seenIds = new Set();
  return recommendations.filter(rec => {
    if (seenIds.has(rec.id)) return false;
    seenIds.add(rec.id);
    return true;
  });
}

// Combines counter recommendations against multiple selected enemies
export function getCombinedEnemyRecommendations(selectedEnemies, myChampion, myRole, resolvedBuild = null) {
  if (!selectedEnemies || selectedEnemies.length === 0 || !resolvedBuild) return [];

  const itemsMap = new Map();

  selectedEnemies.forEach(enemy => {
    if (!enemy) return;
    const recs = getSingleEnemyRecommendations(enemy, myChampion, myRole, resolvedBuild);
    recs.forEach(rec => {
      if (!itemsMap.has(rec.id)) {
        itemsMap.set(rec.id, {
          id: rec.id,
          name: rec.name,
          cost: rec.cost,
          targets: []
        });
      }
      itemsMap.get(rec.id).targets.push({
        championName: enemy.name,
        championIcon: enemy.icon,
        reason: rec.reason
      });
    });
  });

  return Array.from(itemsMap.values());
}
