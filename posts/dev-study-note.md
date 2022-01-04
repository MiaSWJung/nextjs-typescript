---
title: 'Dev Team Study Note'
date: '2021-04-22'
---




# 개발팀 스터디
> 2021.04.22 (목)
> 🔥🔥🔥🔥 원격 스터디 🔥🔥🔥🔥


## 스터디 내용
- Pre-rendering and Data Fetching
- Dynamic Routes

## 주요 쟁점
### fallback true, false, blocking은 무슨 차이가 있을까 ?
Dynamic Route에서, "post/B" 페이지가 pre-rendered 되지 않았을 때,
- `fallback:true` : "post/B" 요청 시 => 넥스트는 백그라운드에서 post/B 페이지를 만들고 응답
- `fallback:false` : "post/B" 요청 시 => 404페이지
- `fallback:blocking` : "post/B" 요청 시 => SSR

> 예시상황
> 총 1000000개의 제품을 가지고 있고, 빌드 타임에 1-100 제품 페이지를 생성했다.
사용자가 101번 제품 상세 페이지에 접근했을 때 세가지의 상황 ~!

#### A. fallback: false
- 현재 페이지를 가지고 있지 않으니 404 페이지로 이동한다.
#### B. fallback: true
1. 로딩페이지가 제공되고,
  - 로딩페이지는 최초 빌드될 때 static으로 가지고 있다!
2. 넥스트는 101 페이지를 렌더한다.
  - 이 때 질문 : 누가(백그라운드) 어디서(서버?클라이언트) 하는 거임?
  - In the **background**, Next.js will **statically** generate the requested path.
  - ~~ISR (SSG + SSR)?~~
  - ISR, SSR개념은 아니고, 요청 시점에 SSG 한다?
    - 페이지가 오래됐는지 검증하는 과정을 포함하지 않으니까
3. 유저는 로딩페이지에서 -> 101 페이지를 볼 수 있다.
#### C. fallback: blocking
- 다이나믹 라우트 요청에 맞춰 ~~SSR~~ 서버에서 렌더링 하고 새로운 페이지 빌드.
  - 빌드된 페이지는 저장된다.
- 페이지 빌드 동안은 사용자에게 아무것도 보여지지 않음
- 페이지 제작이 완료되면 사용자는 그제야 빌드 화면을 보게 됨
- fallback:true가 가지고 있는 맹점인 og: tag와 AMP에 대응하기 위해 개발 됨

#### 더 생각해보기 : ISR
- ISR은 `fallback : true` 를 쓰고 내부에서 검증 로직을 돌린다. -- 데이터가 업데이트 되었는지
- if isFallback
  - 페이지를 가지고 있나?
  - 내가 가지고 있는 페이지가 최신인가? T: 그냥 보여줘, F: 페이지교체하자


### `flallback: blocking`은 왜 나온걸까, 언제쓰는 걸까?
> Generally, the Next.js team encourages you not to use it unless is necessary. Using fallback: 'blocking' doesn't help the SEO.
> Using fallback: 'blocking' makes the user wait 🥱 without any response while the page is being built and it's better to use fallback: true and show a loading skeleton while the page is being built instead.

**OG태그, AMP를 사용하는 경우에 써야겠다!**
- Some og:* crawlers (Facebook, Twitter, LinkedIn, ...) don’t support JS and thus fail to fetch correct og:* tags for fallback: true pages
- AMP pages don’t work correctly with fallback: true as they get stuck loading.
