(() => {
  const language = document.documentElement.lang.toLowerCase();
  const locale = language.startsWith('zh') ? 'zh' : language.startsWith('ko') ? 'ko' : language.startsWith('en') ? 'en' : 'ja';
  const copy = {
    ja: {
      launch: 'メニュー・来店案内', title: 'つばさ 来店案内', close: '閉じる',
      note: '公式サイトに掲載した情報からご案内します。項目を選ぶか、短い質問を入力してください。',
      placeholder: '例：何時まで営業？', question: '質問', send: '送信', initial: '知りたい項目を選んでください。',
      trial: '試験版：現在はFAQ検索で、生成AIは接続していません。入力内容は送信・保存されません。営業変更や食材の確認は店舗へお電話ください。',
      unknown: '掲載情報では確認できませんでした。詳しくは店舗へお電話ください。',
      topics: [
        ['おすすめ', '三日間煮込んだスープの「究極の味噌ラーメン」と、いくら丼とハーフラーメンの「つばさラーメン」を紹介しています。', '/menu/', 'メニューと価格を見る'],
        ['営業時間', '通常は11:00〜翌03:00、毎週月曜日が定休日です。臨時変更は公式サイトのお知らせをご確認ください。', '/access/', '営業時間・アクセスを見る'],
        ['行き方', '札幌市中央区南4条西3丁目1-1、第3グリーンビルの新ラーメン横丁内です。すすきの交差点から徒歩約1分です。', '/access/', '徒歩ルートを見る'],
        ['英語などのメニュー', '公式サイトには英語・中国語（簡体字）・韓国語のメニューページがあります。', '/en/', 'English menu'],
        ['電話・アレルギー', '電話は011-521-5963です。アレルギーや食材は、注文前に必ず店舗へ直接ご相談ください。', 'tel:0115215963', '店舗に電話する']
      ]
    },
    en: {
      launch: 'Menu & visit guide', title: 'Tsubasa visit guide', close: 'Close',
      note: 'Answers use information published on this site. Choose a topic or enter a short question.',
      placeholder: 'e.g. What time do you close?', question: 'Question', send: 'Ask', initial: 'Choose a topic.',
      trial: 'Trial FAQ search; generative AI is not connected. Questions are not sent or stored. Call the restaurant to check schedule changes or ingredients.',
      unknown: 'That detail is not confirmed on this site. Please call the restaurant.',
      topics: [
        ['Popular dishes', 'The site features Ultimate Miso Ramen and Tsubasa Ramen, a half ramen with an ikura rice bowl.', '/en/', 'See menu and prices'],
        ['Hours', 'Usual hours are 11:00 a.m. to 3:00 a.m. the next day, closed Mondays. Check site notices for temporary changes.', '/access/', 'See hours and access'],
        ['Directions', 'Find us inside Shin Ramen Yokocho, 1-1 Minami 4-jo Nishi 3-chome, Chuo-ku, Sapporo, about one minute from Susukino crossing.', '/access/', 'See walking directions'],
        ['Menu languages', 'The official site has English, Japanese, Simplified Chinese, and Korean menus.', '/menu/', 'See all menus'],
        ['Call & allergies', 'Call 011-521-5963. Please discuss allergies and ingredients directly with the restaurant before ordering.', 'tel:0115215963', 'Call the restaurant']
      ]
    },
    zh: {
      launch: '菜单与到店指南', title: 'つばさ 到店指南', close: '关闭',
      note: '根据官方网站公布的信息回答。请选择项目或输入简短问题。',
      placeholder: '例如：营业到几点？', question: '问题', send: '提问', initial: '请选择要了解的项目。',
      trial: '试用版：目前是常见问题检索，未接入生成式AI。输入内容不会发送或保存。营业变更或食材问题请致电店铺。',
      unknown: '官网尚未确认这项信息。详情请致电店铺。',
      topics: [
        ['招牌菜', '官网介绍了究极味噌拉面，以及配有鲑鱼子盖饭与半份拉面的“つばさ拉面”。', '/zh-hans/', '查看菜单和价格'],
        ['营业时间', '通常营业时间为11:00至次日03:00，每周一休息。临时变更请查看官网通知。', '/access/', '查看营业时间'],
        ['路线', '店铺位于札幌市中央区南4条西3丁目1-1第3绿大厦的新拉面横丁内，距薄野十字路口步行约1分钟。', '/access/', '查看步行路线'],
        ['其他语言菜单', '官网提供日语、英语、简体中文和韩语菜单。', '/menu/', '查看所有菜单'],
        ['电话与过敏', '电话：011-521-5963。食物过敏或食材问题，请在点餐前直接联系店铺。', 'tel:0115215963', '拨打电话']
      ]
    },
    ko: {
      launch: '메뉴·방문 안내', title: '츠바사 방문 안내', close: '닫기',
      note: '공식 사이트에 게재된 정보로 안내합니다. 항목을 선택하거나 짧은 질문을 입력하세요.',
      placeholder: '예: 몇 시까지 영업하나요?', question: '질문', send: '질문하기', initial: '궁금한 항목을 선택하세요.',
      trial: '시험판: 현재 FAQ 검색이며 생성형 AI는 연결되지 않았습니다. 입력한 내용은 전송·저장되지 않습니다. 임시 영업 변경이나 식재료는 매장에 전화해 확인하세요.',
      unknown: '공식 사이트에서 확인되지 않은 내용입니다. 자세한 사항은 매장에 전화해 주세요.',
      topics: [
        ['대표 메뉴', '공식 사이트에서는 궁극의 미소 라멘과 이쿠라 덮밥에 하프 라멘을 곁들인 츠바사 라멘을 소개합니다.', '/ko/', '메뉴와 가격 보기'],
        ['영업시간', '통상 11:00부터 다음 날 03:00까지 영업하며 매주 월요일은 정기 휴무입니다. 임시 변경은 공식 공지를 확인하세요.', '/access/', '영업시간 보기'],
        ['찾아오시는 길', '삿포로시 주오구 미나미4조 니시3초메 1-1 제3그린빌딩의 신 라멘 요코초 안에 있습니다. 스스키노 교차로에서 도보 약 1분입니다.', '/access/', '도보 경로 보기'],
        ['다른 언어 메뉴', '공식 사이트에 일본어·영어·중국어 간체·한국어 메뉴가 있습니다.', '/menu/', '전체 메뉴 보기'],
        ['전화·알레르기', '전화번호는 011-521-5963입니다. 알레르기나 식재료는 주문 전에 매장에 직접 문의하세요.', 'tel:0115215963', '매장에 전화하기']
      ]
    }
  }[locale];
  const terms = [
    /おすすめ|人気|味噌|ラーメン|いくら|menu|ramen|miso|popular|招牌|推荐|拉面|메뉴|라멘|추천|미소/i,
    /営業|時間|休み|定休|何時|hour|open|close|when|营业|几点|休息|영업|휴무|몇 시/i,
    /場所|行き|住所|地図|駅|道|where|access|location|direction|map|地址|路线|哪里|位置|위치|주소|길|찾아/i,
    /英語|中国語|韓国語|言語|language|english|chinese|korean|语言|英文|中文|한국어|영어|중국어/i,
    /電話|アレルギ|食材|連絡|tel|call|phone|allerg|ingredient|过敏|电话|食材|알레르기|전화|재료/i
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'tsubasa-guide-dialog';
  dialog.setAttribute('aria-labelledby', 'tsubasa-guide-title');
  dialog.innerHTML = '<div class="tsubasa-guide-head"><div><small>TSUBASA / TRIAL GUIDE</small><h2 id="tsubasa-guide-title"></h2></div><button class="tsubasa-guide-close" type="button"></button></div><div class="tsubasa-guide-body"><p class="tsubasa-guide-note"></p><div class="tsubasa-guide-topics"></div><form class="tsubasa-guide-form"><label for="tsubasa-guide-question" class="tsubasa-guide-label"></label><input id="tsubasa-guide-question" maxlength="120" autocomplete="off"><button type="submit"></button></form><div class="tsubasa-guide-answer" role="status" aria-live="polite"></div><p class="tsubasa-guide-caption"></p></div>';
  document.body.appendChild(dialog);
  dialog.querySelector('h2').textContent = copy.title;
  const close = dialog.querySelector('.tsubasa-guide-close');
  close.textContent = '×'; close.setAttribute('aria-label', copy.close);
  dialog.querySelector('.tsubasa-guide-note').textContent = copy.note;
  dialog.querySelector('.tsubasa-guide-caption').textContent = copy.trial;
  const label = dialog.querySelector('.tsubasa-guide-label');
  label.textContent = copy.question;
  label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
  dialog.querySelector('input').placeholder = copy.placeholder;
  dialog.querySelector('form button').textContent = copy.send;
  const answer = dialog.querySelector('.tsubasa-guide-answer');
  answer.textContent = copy.initial;
  const topics = dialog.querySelector('.tsubasa-guide-topics');
  function show(item) {
    answer.replaceChildren();
    const p = document.createElement('p'); p.textContent = item[1]; answer.appendChild(p);
    const a = document.createElement('a'); a.href = item[2]; a.textContent = item[3] + ' ↗'; answer.appendChild(a);
  }
  copy.topics.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = item[0];
    button.addEventListener('click', () => show(item));
    topics.appendChild(button);
  });
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const query = dialog.querySelector('input').value.normalize('NFKC').trim();
    if (!query) return;
    const order = [4, 1, 2, 3, 0];
    const match = order.find(index => terms[index].test(query));
    show(match === undefined ? ['', copy.unknown, 'tel:0115215963', copy.topics[4][3]] : copy.topics[match]);
  });
  close.addEventListener('click', () => dialog.close());
  const launch = document.createElement('button');
  launch.type = 'button'; launch.className = 'tsubasa-guide-launch'; launch.textContent = copy.launch;
  launch.setAttribute('aria-haspopup', 'dialog'); launch.setAttribute('aria-controls', 'tsubasa-guide-title');
  launch.addEventListener('click', () => { if (!dialog.open) dialog.showModal(); });
  document.body.appendChild(launch);
})();
