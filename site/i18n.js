/* Translations. English lives in index.html; this file holds Turkish page copy
   and the UI strings the charts use in both languages. */
window.I18N = {
  meta: {
    en: { title: 'Seen in the Crowd', locale: 'en-US',
          description: 'Using data on 75,000 games released on Steam between 2018 and 2024: which games get noticed, and which disappear? A data analysis by Batuhan Mermi.' },
    tr: { title: 'Kalabalıkta Görünmek', locale: 'tr-TR',
          description: "Steam'de 2018–2024 arasında çıkan 75 bin oyunun verisiyle: hangi oyunlar fark ediliyor, hangileri kayboluyor? Batuhan Mermi'nin veri analizi çalışması." }
  },

  // Turkish page copy, keyed by data-i18n
  tr: {
    skip: 'İçeriğe geç',
    brandSub: '· veri analizi',
    navMethod: 'Yöntem',
    eyebrow: 'Steam pazar analizi · 2018–2024',
    h1: 'Steam\'de her gün <span data-k="perDay">59</span> oyun çıkıyor. Çoğunu kimse görmüyor.',
    lede: '2018–2024 arasında Steam\'de çıkan <strong data-k="cohort">75.551</strong> oyunu inceledim. Aşağıdaki her nokta 100 oyun. Altın renkte yananlar, en az 500 oyuncu yorumu alabilenler; yani gerçekten bulunup oynananlar.',
    keyDim: '100 oyun',
    keyLit: '100 oyun, 500+ yorum alan',
    seenLabel: 'Görünür olanlar:',
    heroQ: 'Peki bu küçük altın grubu diğerlerinden ayıran ne? Fiyat, tür, dil, özellikler… Veriye tek tek sordum.',

    c1ask: 'Rafa her yıl kaç oyun ekleniyor?',
    c1h: 'Raf on yılda 14 kat kalabalıklaştı',
    c1p: '2014\'te Steam\'e <strong data-k="y2014">1.488</strong> oyun çıktı. 2025\'te bu sayı <strong data-k="y2025">21.530</strong>. Oyun yapmak kolaylaştıkça herkes aynı vitrine dizilmeye başladı. Bu, yeni bir oyunun fark edilmesinin neden her yıl biraz daha zorlaştığını açıklıyor.',
    c1ft: 'Yıllara göre Steam\'e çıkan oyun sayısı',
    c1fs: '2010–2025, yalnızca oyunlar (yazılım ve araçlar hariç)',

    c2ask: 'Oyuncuların ilgisi nasıl dağılıyor?',
    c2h: 'İlginin neredeyse tamamı birkaç oyunda toplanıyor',
    c2p: 'Oyunların yarısı 10 yorumu bile geçemiyor. En çok yorum alan <strong>%1\'lik</strong> dilim, bütün yorumların <strong>%77,6\'sını</strong> topluyor. Alttaki yarı ise toplamın yalnızca <strong>%0,1\'ini</strong> alıyor. Steam bir "ortalama oyun" pazarı değil; kazananı çok, gerisi çok sessiz bir pazar.',
    c2ft: 'Yorum sayısına göre oyunlar ve aldıkları ilgi',
    c2fs: 'Her grubun oyunlar içindeki payı ve tüm yorumlar içindeki payı',
    c2la: 'Oyunların payı',
    c2lb: 'Yorumların payı',

    c3ask: 'Ucuz oyun daha çok fark edilir mi?',
    c3h: 'Ucuz olmak kurtarmıyor',
    c3p: '5 doların altındaki oyunların yalnızca <strong>%5\'i</strong> görünür oluyor. 20–30 dolar bandında bu oran <strong>%29,7</strong>. Düşük fiyat oyuncuya "az emek" sinyali verebiliyor; makul bir fiyat ise "bu ciddi bir oyun" diyor. 30 doların üstünde oran yeniden düşüyor: oyuncular bu fiyatta muhtemelen tanıdık bir stüdyo ya da seri bekliyor.',
    c3ft: 'Fiyat bandına göre görünür olma oranı',
    c3fs: '500+ yorum alan oyunların yüzdesi',

    c4ask: 'En güçlü sinyal hangisi?',
    c4h: 'Oyunun kaç dil konuştuğu, kimin oynadığını belirliyor',
    c4p: 'Tek dilli oyunların yalnızca <strong>%2,8\'i</strong> görünür olurken 11 ve üzeri dil destekleyenlerde bu oran <strong>%23,4</strong>. İlk akla gelen itiraz şu: "Çok dil destekleyenler zaten büyük ve pahalı oyunlar." Bunu test etmek için oyunları aynı fiyat bandında karşılaştırdım. Fark kaybolmadı: 10–20 dolarlık oyunlarda tek dilli olanların <strong>%7,2\'si</strong>, 7+ dilli olanların <strong>%44,6\'sı</strong> görünür.',
    c4ft: 'Aynı fiyat bandında, desteklenen dil sayısına göre görünür olma oranı',
    c4fs: 'Ücretli oyunlar, $0–20 · 500+ yorum alanların yüzdesi',
    c4l1: '1 dil', c4l2: '2–6 dil', c4l3: '7+ dil',

    c5ask: 'Hangi türde rekabet daha az?',
    c5h: 'Herkes Casual yapıyor, oyuncular Aksiyon ve RPG oynuyor',
    c5p: 'Çıkan oyunların <strong>%45,7\'si</strong> Casual etiketi taşıyor ama bu oyunlar tüm yorumların yalnızca <strong>%17,1\'ini</strong> alıyor: arz, talebin çok üstünde. Aksiyon, RPG ve MMO\'da durum tersi. Bu türlerde oyunculardan gelen ilgi, çıkan oyun sayısından çok daha büyük.',
    c5ft: 'Türlerde arz ve talep',
    c5fs: 'Türün çıkan oyunlar içindeki payı ile aldığı yorumlar içindeki payı',
    c5la: 'Çıkan oyunlardaki payı (arz)',
    c5lb: 'Yorumlardaki payı (talep)',
    c5note: 'Bir oyun birden fazla tür taşıyabildiği için yüzdelerin toplamı 100\'ü geçer.',

    c6ask: 'Küçük detaylar fark yaratır mı?',
    c6h: 'Özenin işaretleri görünürlükle birlikte geliyor',
    c6p: 'Bulut kayıt, başarımlar, kol desteği, co-op modu… Bu özellikleri taşıyan oyunlar 1,5 ila 4,6 kat daha sık görünür oluyor. Dürüst olmak gerekirse bu bir neden-sonuç ilişkisi değil: işine özen gösteren ekipler bunların hepsini birden yapıyor. Yine de oyuncunun mağaza sayfasında gördüğü ilk "bu ekip işini ciddiye alıyor" işaretleri bunlar.',
    c6ft: 'Özelliği olan ve olmayan oyunların görünür olma oranı',
    c6fs: '500+ yorum alan oyunların yüzdesi',
    c6la: 'Bu özellik yok',
    c6lb: 'Bu özellik var',

    c7ask: 'Türkçe nerede duruyor?',
    c7h: 'Türkçe destek yavaş ama istikrarlı artıyor',
    c7p: '2014\'te çıkan oyunların <strong>%4,2\'si</strong> Türkçe destekliyordu, 2025\'te <strong>%13,8\'i</strong>. Görünür oyunlarda ise oran neredeyse <strong>dörtte bir</strong>. Başarılı stüdyolar Türk oyuncuyu çoktan hesaba katmış; küçük ekipler için hâlâ boş bir alan var.',
    c7ft: 'Türkçe destekleyen oyunların payı',
    c7fs: 'Çıkış yılına göre, 2014–2025',
    c7la: 'Tüm oyunlar',
    c7lb: 'Görünür oyunlar (500+ yorum)',

    advAsk: 'Peki ne yapmalı?',
    advH: 'Bağımsız bir geliştiriciye ne söylerdim',
    adv1: '<b>Oyunu baştan çevrilebilir kur.</b> Dil desteği, fiyattan bağımsız olarak en güçlü sinyal. Metinleri koda gömmemek, sonradan 7 dile açılmayı ucuzlatıyor. Türkçe de bu listede olsun.',
    adv2: '<b>Fiyatı düşürerek öne çıkmaya çalışma.</b> 10–30 dolar bandı, 5 doların altına göre 4–6 kat daha sık görünür oluyor.',
    adv3: '<b>Kalabalık türde fark yaratmanın yolu işçilik.</b> Casual\'a girilecekse kalite ve kanca belirleyici olacak. Talebin arzdan büyük olduğu RPG ve aksiyon tarafı ise daha az kalabalık bir kapı.',
    adv4: '<b>"Küçük" işleri atlama.</b> Bulut kayıt, başarımlar ve kol desteği birkaç günlük iş ama mağaza sayfasında özen gösterir.',
    adv5: '<b>Çıkış ayına fazla takılma.</b> En iyi ve en kötü ay arasındaki fark yalnızca <span data-k="monthGap">3,3</span> puan. Dil desteği ise oranı %3\'ten %23\'e çıkarabiliyor.',

    mH: 'Yöntem ve sınırlar',
    m1h: 'Veri',
    m1p: 'Herkese açık <a href="https://huggingface.co/datasets/FronkonGames/steam-games-dataset">Steam Games Dataset</a> (MIT lisansı). Steam API ve SteamSpy\'dan toplanmış, <span data-k="total">114.322</span> oyun. Yazılım ve araç ürünleri çıkarıldı. Veri <span data-k="until">8 Eylül 2026</span> tarihine kadar uzanıyor.',
    m2h: '"Görünür" ne demek?',
    m2p: 'En az 500 kullanıcı yorumu alan oyun. Sektörde yaygın kullanılan tahmine göre her yorum kabaca 30–60 satışa denk geliyor; yani bu eşik yaklaşık 15–30 bin satış demek.',
    m3h: 'Neden 2018–2024?',
    m3p: 'Yeni çıkan oyunlar henüz yorum toplayacak zamanı bulamadı. Onları dahil etmek başarı oranını olduğundan düşük gösterirdi. Yıllık çıkış sayıları ise 2025\'i de kapsıyor.',
    m4h: 'Sınırlar',
    m4p: 'Buradaki ilişkiler korelasyon, neden-sonuç değil. Yorum sayısı satışın yaklaşık bir göstergesi. Yalnızca Steam\'e bakıyor; konsol ve mobil dışarıda.',
    stack: 'Araçlar: <b>DuckDB (SQL)</b> ile temizleme ve analiz, <b>Python</b> ile veri hattı, grafikler el yapımı <b>SVG</b>. Her grafiğin altında, onu üreten SQL sorgusunu görebilirsiniz. <a href="https://github.com/BatuhanMRM/steam-market-analysis">Kaynak kod GitHub\'da</a>.',
    footer: 'Analiz ve tasarım: <b>Batuhan Mermi</b>. Veri analisti, oyun geliştirici.'
  },

  // UI strings used by the charts
  ui: {
    en: {
      games: n => `${n} games`,
      theme: { system: 'System', light: 'Light', dark: 'Dark' },
      themeAria: t => `Theme: ${t}. Click to change.`,
      showTable: 'Show table', hideTable: 'Hide table',
      showSQL: 'How I calculated it (SQL)', hideSQL: 'Hide SQL',
      shelfAria: (total, lit, p) => `Of ${total} dots, only ${lit} are gold: ${p} of games pass 500 reviews.`,
      bucket: b => (b === '0' ? 'No reviews' : b.replace('4999', '4,999').replace('5000', '5,000') + ' reviews'),
      band: b => b,
      genre: g => g,
      feature: { cloud: 'Cloud saves (Steam Cloud)', coop: 'Co-op mode', controller: 'Full controller support',
                 achievements: 'Steam achievements', mac_linux: 'Mac / Linux support' },
      shareGames: 'Share of games', shareReviews: 'Share of reviews',
      seenRate: 'Share seen', seen: 'Seen',
      medianReviews: n => `median ${n} reviews`,
      langs: l => `${l} lang`, langsLong: l => `${l} languages`,
      bandGames: b => `${b} games`,
      supply: 'Supply', demand: 'Demand', supplyLong: 'Share of releases', demandLong: 'Share of reviews',
      without: 'Without', with: 'With', withoutLong: 'Without feature', withLong: 'With feature',
      adoption: p => `Present in ${p} of games`,
      allGames: 'All games', seenGames: 'Games seen',
      lineHint: 'Share of games supporting Turkish by year. Use arrow keys to move between years.',
      aria: {
        releases: 'Column chart of games released per year',
        buckets: 'Share of games and reviews by review group',
        price: 'Share of games seen by price band',
        langs: b => `Share seen by number of languages, ${b} price band`,
        genres: 'Supply and demand share by genre',
        features: 'Share seen with and without each feature'
      },
      cols: {
        year: 'Year', games: 'Games', bucket: 'Reviews', shareGames: 'Share of games', shareReviews: 'Share of reviews',
        band: 'Price', seen: 'Seen', medianReviews: 'Median reviews', medianPositive: 'Median positive',
        langs: 'Languages', genre: 'Genre', supply: 'Supply share', demand: 'Demand share',
        feature: 'Feature', with: 'With', without: 'Without', adoption: 'Adoption',
        allGames: 'All games', seenGames: 'Games seen'
      }
    },
    tr: {
      games: n => `${n} oyun`,
      theme: { system: 'Sistem', light: 'Açık', dark: 'Koyu' },
      themeAria: t => `Tema: ${t}. Değiştirmek için tıklayın.`,
      showTable: 'Tabloyu göster', hideTable: 'Tabloyu gizle',
      showSQL: 'Nasıl hesapladım? (SQL)', hideSQL: "SQL'i gizle",
      shelfAria: (total, lit, p) => `${total} noktadan yalnızca ${lit} tanesi altın renkte: oyunların ${p} kadarı 500 yorumu geçiyor.`,
      bucket: b => (b === '0' ? 'Hiç yorum yok' : b.replace('4999', '4.999').replace('5000', '5.000') + ' yorum'),
      band: b => (b === 'Free' ? 'Ücretsiz' : b),
      genre: g => ({ 'Action': 'Aksiyon', 'Adventure': 'Macera', 'Simulation': 'Simülasyon', 'Strategy': 'Strateji',
                     'Free To Play': 'Ücretsiz oyna', 'Sports': 'Spor', 'Racing': 'Yarış' }[g] || g),
      feature: { cloud: 'Bulut kayıt (Steam Cloud)', coop: 'Co-op modu', controller: 'Tam kol desteği',
                 achievements: 'Steam başarımları', mac_linux: 'Mac / Linux desteği' },
      shareGames: 'Oyunların payı', shareReviews: 'Yorumların payı',
      seenRate: 'Görünür olma oranı', seen: 'Görünür',
      medianReviews: n => `medyan ${n} yorum`,
      langs: l => `${l} dil`, langsLong: l => `${l} dil`,
      bandGames: b => `${b} oyunlar`,
      supply: 'Arz', demand: 'Talep', supplyLong: 'Çıkan oyunlardaki payı', demandLong: 'Yorumlardaki payı',
      without: 'Yok', with: 'Var', withoutLong: 'Özellik yok', withLong: 'Özellik var',
      adoption: p => `Oyunların ${p} kadarında var`,
      allGames: 'Tüm oyunlar', seenGames: 'Görünür oyunlar',
      lineHint: 'Yıllara göre Türkçe destek oranları. Yön tuşlarıyla yıllar arasında gezinebilirsiniz.',
      aria: {
        releases: 'Yıllara göre çıkan oyun sayısı sütun grafiği',
        buckets: 'Yorum gruplarına göre oyunların ve yorumların payı',
        price: 'Fiyat bandına göre görünür olma oranı',
        langs: b => `${b} fiyat bandında dil sayısına göre görünür olma oranı`,
        genres: 'Türlere göre arz ve talep payları',
        features: 'Özelliği olan ve olmayan oyunların görünür olma oranı'
      },
      cols: {
        year: 'Yıl', games: 'Oyun', bucket: 'Yorum sayısı', shareGames: 'Oyunların payı', shareReviews: 'Yorumların payı',
        band: 'Fiyat', seen: 'Görünür', medianReviews: 'Medyan yorum', medianPositive: 'Medyan olumlu oran',
        langs: 'Dil sayısı', genre: 'Tür', supply: 'Arz payı', demand: 'Talep payı',
        feature: 'Özellik', with: 'Var', without: 'Yok', adoption: 'Kullanım',
        allGames: 'Tüm oyunlar', seenGames: 'Görünür oyunlar'
      }
    }
  }
};
