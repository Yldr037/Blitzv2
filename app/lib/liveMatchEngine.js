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

// Recommends situational items based on enemy composition and player's archetype (AP, AD/ADC, Fighter, Tank, Support)
export function getSituationalRecommendations(enemies, myChampion, myRole) {
  const recommendations = [];
  
  if (!enemies || enemies.length === 0) return recommendations;

  // Determine player's itemization archetype
  let myArchetype = "Fighter"; // default
  if (myChampion.tags?.includes("Mage")) {
    myArchetype = "AP";
  } else if (myChampion.tags?.includes("Marksman")) {
    myArchetype = "ADC";
  } else if (myChampion.tags?.includes("Tank")) {
    myArchetype = "Tank";
  } else if (myRole === "Support" && myChampion.tags?.includes("Support")) {
    myArchetype = "Support";
  } else if (myChampion.tags?.includes("Assassin")) {
    // If assassin, itemizes similarly to Fighter or AP depending on damage type
    myArchetype = myChampion.info?.magic > myChampion.info?.attack ? "AP" : "Fighter";
  }

  // Calculate enemy team stats
  let apCount = 0;
  let adCount = 0;
  let mixedCount = 0;
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
      mixedCount++;
      // distribute mixed to both or count as both for threats
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
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3102", // Banshee's Veil
        name: "Banshee'ın Duvağı",
        cost: 3100,
        reason: `Rakip takımda yüksek büyü hasarı (${listAp}) bulunduğu için yetenek engelleyen büyü kalkanı ve büyü direnci sağlar.`
      });
    } else if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3156", // Maw of Malmortius
        name: "Malmortius'un Ağzı",
        cost: 2800,
        reason: `Rakip büyü hasarı veren şampiyonlara (${listAp}) karşı canın azaldığında büyük bir sihirli kalkan elde etmeni sağlar.`
      });
    } else if (myArchetype === "ADC") {
      recommendations.push({
        id: "3156", // Maw of Malmortius or Wit's End
        name: "Aklın Sonu",
        cost: 2800,
        reason: `Saldırı hızı ve büyü direnci sağlayarak rakip AP tehdidine (${listAp}) karşı hayatta kalmana yardımcı olur.`
      });
    } else if (myArchetype === "Tank") {
      recommendations.push({
        id: "2504", // Kaenic Rookern
        name: "Kutluyas Rukern",
        cost: 2900,
        reason: `Rakipte yüksek AP hasarı (${listAp}) var. Çatışma dışındayken azami canına oranla devasa bir büyü kalkanı kazanarak AP burstünü tamamen engeller.`
      });
    }
  }

  // 2. Anti-AD / Anti-Crit
  if (adCount >= 2.5) {
    const listAd = adNames.slice(0, 3).join(", ");
    
    // Suggest Steelcaps for boots if AD is high
    recommendations.push({
      id: "3047", // Plated Steelcaps
      name: "Çelik Kaplamalı Çizme",
      cost: 1000,
      reason: `Rakip takımda çok fazla fiziksel hasar ve düz vuruş odaklı şampiyon (${listAd}) olduğu için düz vuruşlardan alınan hasarı %12 azaltır.`
    });

    if (myArchetype === "AP") {
      recommendations.push({
        id: "3157", // Zhonya's Hourglass
        name: "Zhonya'nın Kumsaati",
        cost: 3250,
        reason: `Rakip AD şampiyonların (${listAd}) anlık hasarından kurtulmak ve kendini korumak için 2.5 saniye boyunca hedef alınamaz olmanı sağlar.`
      });
    } else if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3010", // Death's Dance
        name: "Ölümün Dansı",
        cost: 3200,
        reason: `Alınan fiziksel hasarın %30'unu zamana yayarak rakip AD kompozisyonuna (${listAd}) karşı anlık elenmeni engeller ve alt etmelerde can yeniler.`
      });
    } else if (myArchetype === "ADC") {
      recommendations.push({
        id: "3026", // Guardian Angel
        name: "Koruyucu Melek",
        cost: 3000,
        reason: `Saldırı gücü ve zırh verir. Rakip AD suikastçılar/taşıyıcılar (${listAd}) seni düşürdüğünde yeniden canlanmanı sağlar.`
      });
    } else if (myArchetype === "Tank") {
      recommendations.push({
        id: "3143", // Randuin's Omen
        name: "Randuin'in Alameti",
        cost: 2700,
        reason: `Rakipte düz vuruş veya kritik hasar odaklı şampiyonlar (${listAd}) var. Kritik vuruş hasarını azaltır ve rakipleri yavaşlatır.`
      });
      recommendations.push({
        id: "3110", // Frozen Heart
        name: "Donmuş Yürek",
        cost: 2300,
        reason: `Düşük maliyetle yüksek zırh sağlar ve yakındaki düşmanların saldırı hızını azaltarak AD taşıyıcıları zayıflatır.`
      });
    }
  }

  // 3. Anti-Healing (Grievous Wounds / Ağır Yara)
  if (healerCount >= 1) {
    const listHealer = healerNames.join(", ");
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3165", // Morellonomicon
        name: "Morellonomikon",
        cost: 2200,
        reason: `Rakipte yüksek iyileşme/yenilenme gücüne sahip şampiyonlar (${listHealer}) var. Büyü hasarı verdiğinde rakiplerin iyileştirme etkilerini %40 azaltır.`
      });
    } else if (myArchetype === "ADC" || myArchetype === "Fighter") {
      recommendations.push({
        id: "3033", // Mortal Reminder or Chempunk Chainsword (id: 3091)
        name: "Ölüm Hatırası / Kimyasal Kimya-Pala",
        cost: 3000,
        reason: `Rakipteki iyileşme etkilerini (${listHealer}) kırmak için fiziksel hasar verdiğinde %40 Ağır Yara uygular.`
      });
    } else if (myArchetype === "Tank") {
      recommendations.push({
        id: "3075", // Thornmail
        name: "Çivili Zırh",
        cost: 2700,
        reason: `Rakipteki yenilenme şampiyonlarına (${listHealer}) karşı düz vuruş aldığında rakiplere %40 Ağır Yara uygular ve yüksek zırh sağlar.`
      });
    }
  }

  // 4. Anti-Tank (Penetration / Yüzdesel Hasar)
  if (tankCount >= 2) {
    const listTanks = tankNames.slice(0, 2).join(", ");
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3135", // Void Staff
        name: "Boşluk Değneği",
        cost: 3000,
        reason: `Rakip ön saflardaki tanklar (${listTanks}) yüksek büyü direnci çıktığı için büyü hasarının %40'ının büyü direncini yok saymasını sağlar.`
      });
    } else if (myArchetype === "ADC") {
      recommendations.push({
        id: "3036", // Lord Dominik's Regards
        name: "Dominik Efendi'nin Hürmeti",
        cost: 3000,
        reason: `Yüksek zırh kasan tanklara (${listTanks}) karşı %35 zırh delme ve kritik şansı sağlar.`
      });
    } else if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3071", // Black Cleaver
        name: "Kara Balta",
        cost: 3000,
        reason: `Rakip tankların (${listTanks}) zırhını her vuruşta eksilterek tüm takımının onlara daha fazla fiziksel hasar vurmasını sağlar.`
      });
    }
  }

  // 5. Anti-Burst / Anti-Assassin
  if (burstCount >= 2) {
    const listBurst = burstNames.slice(0, 2).join(", ");
    if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3053", // Sterak's Gage
        name: "Sterak'ın Güvencesi",
        cost: 3000,
        reason: `Rakip suikastçıların/anlık hasar kaynaklarının (${listBurst}) seni tekte eritmesini önlemek için yüksek miktarda can kalkanı verir.`
      });
    } else if (myArchetype === "AP" && !recommendations.some(r => r.id === "3157")) {
      recommendations.push({
        id: "3157",
        name: "Zhonya'nın Kumsaati",
        cost: 3250,
        reason: `Rakip suikastçıların (${listBurst}) burst hasarını/yeteneklerini boşa çıkarmak için durdurulamaz altın modunu kullanabilirsin.`
      });
    }
  }

  // 6. Anti-CC / Slow
  if (ccCount >= 2) {
    const listCc = ccNames.slice(0, 3).join(", ");
    recommendations.push({
      id: "3111", // Mercury's Treads
      name: "Merkür'ün Adımları",
      cost: 1200,
      reason: `Rakipte yoğun kitle kontrolü (${listCc}) bulunuyor. Sıvışma özelliği vererek sersemletme, yavaşlatma ve kışkırtma sürelerini %30 azaltır.`
    });
  }

  // Fallback / General items if recommendations are empty
  if (recommendations.length === 0) {
    if (myArchetype === "Tank") {
      recommendations.push({
        id: "6665",
        name: "Şahbaz Jak'Sho",
        cost: 3200,
        reason: "Karmaşık hasar dağılımına karşı savaş uzadıkça zırh ve büyü direncini arttırır."
      });
    } else if (myArchetype === "AP") {
      recommendations.push({
        id: "3089",
        name: "Rabadon'un Ölüm Şapkası",
        cost: 3600,
        reason: "Genel yetenek gücünü devasa oranda arttırarak hasarını maksimize eder."
      });
    } else {
      recommendations.push({
        id: "3072",
        name: "Kanasusamış",
        cost: 3400,
        reason: "Genel hayatta kalma ve yüksek can çalma/saldırı gücü takviyesi."
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

// Recommends situational items against a single selected enemy champion
export function getSingleEnemyRecommendations(enemy, myChampion, myRole) {
  const recommendations = [];
  if (!enemy) return recommendations;

  const name = enemy.name;
  const dmgType = getChampionDamageType(enemy);
  const isHealer = HEAL_CHAMPIONS.has(enemy.id) || HEAL_CHAMPIONS.has(enemy.name);
  const isBurst = BURST_CHAMPIONS.has(enemy.id) || BURST_CHAMPIONS.has(enemy.name);
  const isCc = CC_CHAMPIONS.has(enemy.id) || CC_CHAMPIONS.has(enemy.name);
  const isTank = enemy.tags?.includes("Tank") || (enemy.tags?.includes("Fighter") && enemy.info?.defense >= 6);

  // Determine player's itemization archetype
  let myArchetype = "Fighter";
  if (myChampion.tags?.includes("Mage")) {
    myArchetype = "AP";
  } else if (myChampion.tags?.includes("Marksman")) {
    myArchetype = "ADC";
  } else if (myChampion.tags?.includes("Tank")) {
    myArchetype = "Tank";
  } else if (myRole === "Support" && myChampion.tags?.includes("Support")) {
    myArchetype = "Support";
  } else if (myChampion.tags?.includes("Assassin")) {
    myArchetype = myChampion.info?.magic > myChampion.info?.attack ? "AP" : "Fighter";
  }

  // 1. Anti-AP (Magic Resist)
  if (dmgType === "AP") {
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3102",
        name: "Banshee'ın Duvağı",
        cost: 3100,
        reason: `${name} büyü hasarı (AP) odaklı bir şampiyon. Yetenek engelleyen büyü kalkanı ve büyü direnci sağlayarak onun anlık hasarından korunmanı sağlar.`
      });
    } else if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3156",
        name: "Malmortius'un Ağzı",
        cost: 2800,
        reason: `${name}'in büyü hasarına karşı dövüşçüler için en iyi savunma eşyasıdır. Canın azaldığında büyük bir sihirli kalkan elde etmeni sağlar.`
      });
    } else if (myArchetype === "ADC") {
      recommendations.push({
        id: "3111", // Wit's End represented by boots/MR item in DDragon
        name: "Merkür'ün Adımları / Wit's End",
        cost: 2800,
        reason: `${name} büyü hasarı vuruyor. Hem büyü direnci hem de kitle kontrolünden kurtulmak için koruyucu etki sağlar.`
      });
    } else if (myArchetype === "Tank") {
      recommendations.push({
        id: "2504",
        name: "Kutluyas Rukern",
        cost: 2900,
        reason: `${name} büyü hasarı veriyor. Kutluyas Rukern tanklar için azami cana oranla devasa bir büyü kalkanı kazandırarak AP hasarını soğurur.`
      });
    }
  }

  // 2. Anti-AD / Anti-Crit
  if (dmgType === "AD") {
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3157",
        name: "Zhonya'nın Kumsaati",
        cost: 3250,
        reason: `${name} fiziksel hasar (AD) odaklı bir şampiyon. Zhonya'nın Kumsaati zırh verir ve anlık kritik durumlarda hedef alınamaz olmanı sağlar.`
      });
    } else if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3010",
        name: "Ölümün Dansı",
        cost: 3200,
        reason: `${name}'in fiziksel hasarına karşı dövüşçüler için harikadır. Hasarın %30'unu zamana yayar ve alt etmelerde can yeniler.`
      });
    } else if (myArchetype === "ADC") {
      recommendations.push({
        id: "3026",
        name: "Koruyucu Melek",
        cost: 3000,
        reason: `${name}'in fiziksel hasar baskısına karşı nişancılar için zırh ve düştüğünde yeniden canlanma özelliği sağlar.`
      });
    } else if (myArchetype === "Tank") {
      recommendations.push({
        id: "3143",
        name: "Randuin'in Alameti",
        cost: 2700,
        reason: `${name} fiziksel hasar veriyor. Randuin, zırh vermesinin yanında kritik vuruşlardan alınan hasarı azaltır ve rakipleri yavaşlatır.`
      });
      recommendations.push({
        id: "3110",
        name: "Donmuş Yürek",
        cost: 2300,
        reason: `${name} düz vuruş/saldırı hızı odaklı fiziksel hasar vuruyor. Donmuş Yürek yüksek zırh verir ve rakibin saldırı hızını azaltır.`
      });
    }
  }

  // 3. Anti-Healing (Ağır Yara)
  if (isHealer) {
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3165",
        name: "Morellonomikon",
        cost: 2200,
        reason: `${name} yüksek iyileşme/can çalma yeteneğine sahip. Morellonomikon büyü hasarı verdiğinde rakibe Ağır Yara uygulayarak iyileşmesini %40 azaltır.`
      });
    } else if (myArchetype === "ADC" || myArchetype === "Fighter") {
      recommendations.push({
        id: "3033",
        name: "Ölüm Hatırası",
        cost: 3000,
        reason: `${name}'in can çalma/iyileşme etkilerini zayıflatmak için fiziksel hasar verdiğinde rakibe %40 Ağır Yara uygulayan bu eşyayı almalısın.`
      });
    } else if (myArchetype === "Tank") {
      recommendations.push({
        id: "3075",
        name: "Çivili Zırh",
        cost: 2700,
        reason: `${name}'in iyileşme gücünü azaltmak için düz vuruş aldığında rakibe %40 Ağır Yara uygulayan Çivili Zırh satın almalısın.`
      });
    }
  }

  // 4. Anti-Tank (Zırh / Büyü Nüfuzu)
  if (isTank) {
    if (myArchetype === "AP") {
      recommendations.push({
        id: "3135",
        name: "Boşluk Değneği",
        cost: 3000,
        reason: `${name} yüksek dirençlere sahip bir tank. Boşluk Değneği büyü direncinin %40'ını yok sayarak AP hasarını tanka karşı korur.`
      });
    } else if (myArchetype === "ADC") {
      recommendations.push({
        id: "3036",
        name: "Dominik Efendi'nin Hürmeti",
        cost: 3000,
        reason: `${name} zırhı yüksek bir tank. Dominik Efendi zırh delme (%35) vererek tankı eritmeni sağlar.`
      });
    } else if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3071",
        name: "Kara Balta",
        cost: 3000,
        reason: `${name} tank olduğu için her vuruşunda zırhını eksilten Kara Balta, hem sana hem de takımına fiziksel hasar avantajı sağlar.`
      });
    }
  }

  // 5. Anti-Burst (Sterak / Zhonya / GA)
  if (isBurst) {
    if (myArchetype === "Fighter") {
      recommendations.push({
        id: "3053",
        name: "Sterak'ın Güvencesi",
        cost: 3000,
        reason: `${name} anlık yüksek hasar (burst) potansiyeline sahip. Sterak, anlık hasar aldığında sana devasa bir can kalkanı verir.`
      });
    } else if (myArchetype === "AP" && !recommendations.some(r => r.id === "3157")) {
      recommendations.push({
        id: "3157",
        name: "Zhonya'nın Kumsaati",
        cost: 3250,
        reason: `${name}'in anlık hasar kombolarını veya suikast girişimlerini tamamen boşa çıkarmak için Zhonya'nın aktif altın modunu kullanabilirsin.`
      });
    }
  }

  // 6. Anti-CC (Sıvışma / Merkür)
  if (isCc) {
    recommendations.push({
      id: "3111",
      name: "Merkür'ün Adımları",
      cost: 1200,
      reason: `${name} yüksek kitle kontrolüne sahip. Merkür'ün Adımları sıvışma vererek sersemletme, yavaşlatma vb. kitle kontrolü sürelerini %30 kısaltır.`
    });
  }

  // Deduplicate
  const seenIds = new Set();
  return recommendations.filter(rec => {
    if (seenIds.has(rec.id)) return false;
    seenIds.add(rec.id);
    return true;
  });
}

// Combines counter recommendations against multiple selected enemies (for 2v2 bot/support matchup)
export function getCombinedEnemyRecommendations(selectedEnemies, myChampion, myRole) {
  if (!selectedEnemies || selectedEnemies.length === 0) return [];

  const itemsMap = new Map();

  selectedEnemies.forEach(enemy => {
    if (!enemy) return;
    const recs = getSingleEnemyRecommendations(enemy, myChampion, myRole);
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


