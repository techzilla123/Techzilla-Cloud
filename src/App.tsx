import { useEffect, useMemo, useRef, useState } from "react"

type IconName = "arrow" | "check" | "chevron" | "cloud" | "download" | "grid" | "heart" | "home" | "image" | "menu" | "more" | "music" | "pause" | "play" | "search" | "settings" | "share" | "sparkles" | "upload" | "video" | "x"

function Icon({
  name,
  size = 20,
  filled = false,
}: {
  name: IconName
  size?: number
  filled?: boolean
}) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    cloud: (
      <path d="M6.5 19h11a4.5 4.5 0 0 0 .4-8.98A6 6 0 0 0 6.53 8.1 5.5 5.5 0 0 0 6.5 19Z" />
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4" />
        <path d="M5 20h14" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    heart: (
      <path
        fill={filled ? "currentColor" : "none"}
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
      />
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 15-5-5L5 20" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </>
    ),
    pause: <path d="M8 5v14M16 5v14" />,
    play: <path fill="currentColor" d="m8 5 11 7-11 7Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.7 10.7 6.6-4.1M8.7 13.3l6.6 4.1" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9L12 3Z" />
        <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m-4 4 4-4 4 4" />
        <path d="M5 20h14" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="5" width="14" height="14" rx="3" />
        <path d="m17 10 4-2v8l-4-2" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

type PhotoItem = {
  id: number
  title: string
  meta: string
  src: string
  size?: number
  tone?: string
}

type VideoItem = {
  id: number
  title: string
  meta: string
  src: string
  poster: string
  size?: number
}

type MediaManifest = {
  photos: PhotoItem[]
  videos: VideoItem[]
  updatedAt?: string
}

const photos: PhotoItem[] = [
  {
    id: 1,
    title: "Cappadocia Sunrise",
    meta: "Today · 8.4 MB",
    src: "/media/balloons.jpg",
    tone: "mint",
  },
  {
    id: 2,
    title: "Kyoto Stories",
    meta: "Yesterday · 6.2 MB",
    src: "/media/kyoto.jpg",
    tone: "peach",
  },
  {
    id: 3,
    title: "Hidden Falls",
    meta: "Jun 18 · 12.8 MB",
    src: "/media/waterfall.jpg",
    tone: "blue",
  },
  {
    id: 4,
    title: "Pacific Quiet",
    meta: "Jun 12 · 7.1 MB",
    src: "/media/coast.jpg",
    tone: "lilac",
  },
  {
    id: 5,
    title: "Lakeside Color",
    meta: "May 30 · 9.7 MB",
    src: "/media/lakeside.jpg",
    tone: "mint",
  },
  {
    id: 6,
    title: "Window Seat",
    meta: "May 22 · 5.3 MB",
    src: "/media/flight.jpg",
    tone: "peach",
  },
]

const videos: VideoItem[] = [
  {
    id: 11,
    title: "The summer edit",
    meta: "00:05 · 24 MB",
    src: "/media/sample-video.mp4",
    poster: "/media/coast.jpg",
  },
  {
    id: 12,
    title: "Weekend in Kyoto",
    meta: "00:05 · 18 MB",
    src: "/media/sample-video.mp4",
    poster: "/media/kyoto.jpg",
  },
  {
    id: 13,
    title: "Chasing waterfalls",
    meta: "00:05 · 31 MB",
    src: "/media/sample-video.mp4",
    poster: "/media/waterfall.jpg",
  },
  {
    id: 14,
    title: "Above the clouds",
    meta: "00:05 · 22 MB",
    src: "/media/sample-video.mp4",
    poster: "/media/flight.jpg",
  },
  {
    id: 15,
    title: "A colorful escape",
    meta: "00:05 · 28 MB",
    src: "/media/sample-video.mp4",
    poster: "/media/lakeside.jpg",
  },
  {
    id: 16,
    title: "Cappadocia diary",
    meta: "00:05 · 35 MB",
    src: "/media/sample-video.mp4",
    poster: "/media/balloons.jpg",
  },
]

const dropboxFolderUrl =
  "https://www.dropbox.com/scl/fo/3wgrbau3rt5591co01bj3"
const dropboxFolderKey = "ga816npxdmx8exnmm35masmh9"

const dropboxFiles: [string, string][] = [
  ["010.mp3", "AGSHMly3Q42Hhps2-lHwiaY"],
  ["017.mp3", "AKUQzl-DvCR2vHvhbQUiJzA"],
  ["018.mp3", "AOufSm24c0xgZCu3b2fZRSY"],
  ["019.mp3", "ANdNhLlrxv4GgEjRNGFEI04"],
  ["033.mp3", "APuedlvkB4Bbns9RAreUyfY"],
  ["037.mp3", "AN6WHOLZdTh6TfGOUn1Z5Gw"],
  ["051.mp3", "AMSgLIi7H3vnaJjVegL9dLI"],
  ["053.mp3", "AN5vsYloXMPTMLDEyO2wp-s"],
  ["054.mp3", "AFSo5s3agS_Rcbu-OhXG2vI"],
  ["056.mp3", "AJcx0c1mCBAmignpcQwHVMg"],
  ["058.mp3", "APc6sFwmDIjJ8zuCY3Jt184"],
  ["059.mp3", "AEAeYQ-dythFH_OlP7rKiMA"],
  ["061.mp3", "AL-tfOuDXsC5tHQM6TzSiBM"],
  ["062.mp3", "AMEckk0XZFHOzOxUKPr5B6Q"],
  ["063.mp3", "AB6deUSuwW-F5XD-tWCfXA4"],
  ["075.mp3", "AMfQhvQdFSllUgiFxV2-jVQ"],
  ["078.mp3", "AKhCnJMPB-JFpUZ32owOkR4"],
  ["079.mp3", "AHdO3VwliKSDckfFWsIHmz8"],
  ["080.mp3", "AN4OeyHNkFudDTv2hZlee_E"],
  ["081.mp3", "AIktM78P4cAY5NLTxMYZ2qo"],
  ["082.mp3", "AEIwip5ejUNB0G0brnydJnI"],
  ["083.mp3", "ANOiWI5HnIQIj0WEp8rUMWA"],
  ["084.mp3", "AFrMaRkAj4SvJGrLdF5c5eg"],
  ["085.mp3", "AGsM0qPtbK9XPEun4RDAxb0"],
  ["086.mp3", "APgrY37ld8hVLdrm-Tuqheg"],
  ["087.mp3", "AJsetQ-mjqkb6oYU7yKcs-Y"],
  ["088.mp3", "ALis9dOorh91x-71T_mq5j8"],
  ["089.mp3", "ANGCF02FUnIyfQf_3Jk8N3U"],
  ["090.mp3", "ABIF24XVClyvIf_W6OiYGLg"],
  ["091.mp3", "ANoNZPA96Qve9hfizh4gz38"],
  ["092.mp3", "AHri79jRUTbcDfQnwdzx7gM"],
  ["093.mp3", "APV0wpCqDfcPZR4i0jb2KD8"],
  ["094.mp3", "AO94D7fMXM-JxPot_fbCkw4"],
  ["095.mp3", "AD3zAG72xPQZczHmU_jvqv0"],
  ["096.mp3", "AHMDNQXG-D0G05ZwZv5n_w8"],
  ["097.mp3", "AFyOtNg_K0ilx3XuTvTrKc0"],
  ["098.mp3", "AF6d6yChmBQXsxUzuEynMuQ"],
  ["099.mp3", "AItncrMEMqlVFKiDsitJGgs"],
  ["100.mp3", "AKA3f4WbZzwcV10RFXQmlX4"],
  ["101.mp3", "AEOTmcAGStU_iJiSgjt_K84"],
  ["102.mp3", "AC2_nKyxPvBrjNyMnIbZJSU"],
  ["103.mp3", "ALInkJmEFxo1Xahe_LHVHd0"],
  ["104.mp3", "AL3U0G8CrE-iXCz7hCgoyKQ"],
  ["105.mp3", "AA2WQTj-Lw4PF8QGsbPGgxE"],
  ["106.mp3", "ALyxLnoOO_ZwcWD0qMzZ_78"],
  ["107.mp3", "ACSqBBqr_uq9SVpK2aByYlo"],
  ["108.mp3", "AOMW28_c9CYnLAYk4LIzW2s"],
  ["109.mp3", "AOlc6fB-C4aaNUBJRzjWseM"],
  ["110.mp3", "AHrf42kV837DN7tybonFpMY"],
  ["111.mp3", "ANJHuJBOH3Y6SuZ6RbyNjv0"],
  ["112.mp3", "APwO4jBitkthcSM91CTthAg"],
  ["113.mp3", "ALdYymB1ORgW0pxfbEYzleQ"],
  ["114.mp3", "AG3UbDBXPYK5Z8yM7PAKNO4"],
  ["ahmed-abou-kasmi-031-muslimcentral.com.mp3", "AGZs8BiJXeV8R9kvvwsNc30"],
  ["Ajebo_Hustlers_Ft_Victony_-_Ave_Maria.mp3", "AHFPtCctMSjLj6e_I5Koic4"],
  ["Al Qunnut.mp3", "APo2jRHg4jUSTFf_TJ3baew"],
  ["ANOBI_NI_by_Adhakir_Faozu_Zaman_ft_MTN_D_Icon(128k).mp3", "AJgn5hv3fU8_ZQOHDPXHhxM"],
  ["Asake_-_Uhh_Yeah.mp3", "AFEXBgdMoud_RLgCVFwDE7Y"],
  ["Asake_-_Worldwide.mp3", "ADXrq7EelZAicb7KG5qhGUQ"],
  ["Ashidapo_Ft_Asake_-_BROTHER.mp3", "AHnlBl3_d3dzm54hbqSAk4k"],
  ["AUD-20250604-WA0003.aac", "AHz0v2LfRoG8eTLFdq4vezo"],
  ["AUD-20250625-WA0007.aac", "AFBF3YwMYg111ZMUWrc80NQ"],
  ["AUD-20250625-WA0008.aac", "AKxkmdifX47pL1iKl7lC0I8"],
  ["Bella_Shmurda_-_Shalaye.mp3", "APW-MG0Po_knAH0DCfw9V_s"],
  ["Boj_Ft_Victony_-_Pressure.mp3", "AM5XBTp9DSoqTvn_Q9oDoq8"],
  ["dd_1.m4a", "AIk7-A1aospoPEEU4EA1Ilk"],
  ["dd.m4a", "AMD02JAxpZrDy-t6HxOh2Fw"],
  ["dd.mp3", "AOPOUWDr46vd5zT8vdanRS0"],
  ["Destiny-Boy-feat-Ifayomiobaedu-Oro-Piano-(www.holymp3.com.ng).mp3", "AGO42-jbuBrpG9Xk1oWhaJQ"],
  ["DJ_SkinnyFt_Terry_Apala_Tolibian_-_Money.mp3", "ACzcYCiSC3nGQaVTa5ap5kE"],
  ["DJ_Tunez_Ft_Wizkid_Seyi_Vibez_Terry_Apala_-_APALA_DISCO_Remix_.mp3", "ALRPatwyTOIMeQXyJAMCAMo"],
  ["Faozu_Zaman___Hamu_Jedeed(128k).mp3", "AGO3Xm1gESisg3PBPu8hOkA"],
  ["Faozu_Zaman_-_Gbo_Adura_Mi(128k).mp3", "AGV-NEfkkSkCZP5NN4YzeEI"],
  ["Fido-Awolowo-Remix-feat-Kapo-(Vistanaij.com).mp3", "AAJ-DQvniQssr59u4xvpjM0"],
  ["Fola_-_Alone_Remix_feat_BNXN_fka_Buju__Vistanaij.com.ng.mp3", "ANUQPCGsmdWYcxH8NyIRn6w"],
  ["FORGIVENESS(128k).mp3", "AMTfOpA-Nhik6Pk3ymVJF50"],
  ["GET 502.mp3", "AHiI1b65WHJDU_ccaNWTPsY"],
  ["GET 502.wav", "AFCJ5ewJjrQOBJn_RECu_C0"],
  ["Hard Tune C Major.m4a", "AFLAbMVeiSNH1-0oCJpGbZ4"],
  ["Hausapiano-Dahu-Dahu.mp3", "AB_MHWCdDPqKb9Su_GMHxvg"],
  ["hh_2024-09-01_175804815.mp3", "AAf-IgpV3YbIeU8iu-mTubc"],
  ["Islambo_ft_Tolibian_-_Fake_New_Real_.mp3", "AAcK2Y3BSURM7Y6ouEqW6IE"],
  ["Iyanya_Ft_Young_Duu_Tolibian_-_Sweet_Life.mp3", "ABANsieDTdih7U6VFEuv0Z0"],
  ["JABAL(128k).mp3", "ACkNU_Ly4maDxlCnyvFxLxU"],
  ["JeriQ_Ft_Victony_-_Daily_Bread.mp3", "APWn8OrqTWdhELjtrQ-2B7Q"],
  ["Joblaq-Jo-Vibe-feat-Peller-(Vistanaij.com).mp3", "APeAVOC36phxsmTvFtlwIFU"],
  ["Juls_Ft_Victony_-_Saint_Tropez.mp3", "AE_o-GqLo_6FGT5fTt-uKiw"],
  ["Kizz_Daniel_-_Marhaba_Vistanaij.com.ng.mp3", "AMQa-LMPF66QQgjbfkbk4KE"],
  ["Kizz_Daniel_Ft_Adekunle_Gold_-_Pano_Tona.mp3", "ACreh-_Rsx4z7HL6sIVAcf8"],
  ["Kvng-Vinci-Ft-Zerrydl-Hausapiano-Remix-(TrendyBeatz.com).mp3", "AAeEEtecM4HFQyZDwyq8LEw"],
  ["Lad_-_Fade_Away.mp3", "AMUJE3OkUZvtBGspKKkBOVg"],
  ["Lad_-_Letting_Go.mp3", "ANpBAtb8Oh0BWMxwJ7DQrW8"],
  ["Lad_-_No_Pressure.mp3", "AOv_4RNh95xBREVN8ylhbj4"],
  ["Lad_Ft_Ayanfe_-_Titikati.mp3", "AI4l8O0UaCY5XGTt5hhBcCQ"],
  ["Lade_Ft_Olamide_-_One_By_One.mp3", "APQLgZcpR18wqZoHzy0EzGY"],
  ["Lil_Frosh_Ft_Zinoleesky_-_Waloda.mp3", "ABycMwPg9Md-53iq8t441NY"],
  ["mahmood-al-rifai-055-muslimcentral.com.mp3", "AJcGMUDmt6NJtWEg43PK9x4"],
  ["Mayorkun_Ft_Fireboy_DML_-_Innocent.mp3", "AAiBgxPtF6_wWy375-f1Ywk"],
  ["mishary-rashid-alafasy-060-muslimcentral.com.mp3", "ADp7qYtORHJHjEWO_Ifnnr4"],
  ["Naira_Marley_-_OMO_on_my_own_.mp3", "ACqrrz-81Lm6YDD5eupYEAY"],
  ["Naira_Marley_-_Wahala.mp3", "ADe8v7D6Ap9eZFSDMS92dhY"],
  ["Naira_Marley_Ft_Zinoleesky_Vusic_-_Kowope.mp3", "AIOt9QtkmaCRI-wGVKbE3-I"],
  ["Nasheed_-_Liyakun_Yawmuka___Nasheed_Remix___#LiyakunYawmuka(128k).mp3", "AKHPjl4qv_xg7iauuxFQ3pM"],
  ["Nasty_C_Ft_Lekaa_Beats_Tiwa_Savage_-_One_Time.mp3", "AFkKbrOrfFIPfdNADbwtVvY"],
  ["Nicki_Minaj-_Ft_David_Guetta_Davido_-_If_It_s_Okay.mp3", "AF0Y97Si3JmjghLInofj3TY"],
  ["Ojazzyigbonile-Oja-Culture-(Vistanaij.com).mp3", "ABMUza5eZadCdMbY_RlGRqI"],
  ["Oluwadolarz-Whistle-feat-Rybeena-(Vistanaij.com).mp3", "ALjDVnLhXuKmt1bzUmd75IY"],
  ["Omah_Lay_-_Hello_Brother_Vistanaij.com.ng.mp3", "ACLwg3PAY5rhd2VNkzS9wbU"],
  ["Peruzzi_Ft_Olamide_-_Jah_Love.mp3", "ABN1PZAaP1egHoyF2bk4mjg"],
  ["Portable-Canabis-(Vistanaij.com).mp3", "AEFr-z5RrvYotMdNfR6pxcQ"],
  ["Portable-Mind-Your-Own-(Vistanaij.com).mp3", "AKb5yOuz6lGjfwTut5b8yfs"],
  ["Portable-Original-(Vistanaij.com).mp3", "AAFEWmf2mcIPySTl78lwc4M"],
  ["Portable-Success-(Vistanaij.com).mp3", "ANGJ1An6kwGdfd9WvMQgO0Y"],
  ["Portable-Tiwa-Tiwa-(Vistanaij.com).mp3", "ANjE_qgCuTi0RVIFjYyHd3U"],
  ["Raji-Monsur.aac", "AEI_J2WKZSWa64oPc8XSmI0"],
  ["Rema_-_Is_It_A_Crime_.mp3", "AO_Ek5K2n5R0ZxDoHay2BKA"],
  ["Ruger_Ft_Tiwa_Savage_-_Toma_Toma.mp3", "AMmozhnY9s6v_TceaZqWdoA"],
  ["Sarkodie_Ft_Victony_-_JAILER.mp3", "AM8CAMl4Q8j62k1Nc9xD2_g"],
  ["Seyi_Vibez_-_Abu_Dhabi.mp3", "AKWRczBRpy9oxo5iz9DZpFA"],
  ["Seyi_Vibez_-_Albert_Einstein.mp3", "AE9wspgjUkzrHz8UEvsNdTg"],
  ["Seyi_Vibez_-_Casablanca.mp3", "APh-QCgwDJAe1BQNippcZGQ"],
  ["Seyi_Vibez_-_Doha.mp3", "AD8OaD7vNKlPjuKHKVYdtqs"],
  ["Seyi_Vibez_-_Lagos.mp3", "AD9uMf6P9mMc7grVaeW1GY0"],
  ["Seyi_Vibez_-_Manchester.mp3", "AAwB6VS5yATGO2faVjf_YN8"],
  ["Seyi_Vibez_-_Santorini.mp3", "APFNoT29dnL9Ipw10g_Sz4k"],
  ["Seyi_Vibez_Ft_Bella_Shmurda_-_No_Caution_Gbemidebe_.mp3", "AEuRHVmuWoOS1gZI3PZUiTs"],
  ["Simi_-_Alafia_feat_Bella_Shmurda__Vistanaij.com.ng.mp3", "AFLMNHiRr3hKistHWVRSZCE"],
  ["Simi_-_Borrow_Me_Your_Baby_feat_Falz__Vistanaij.com.ng.mp3", "AOyLCpwmBho2vk7o7jJdfRY"],
  ["Simi_-_Lost_And_Found_Vistanaij.com.ng.mp3", "ABJsd87K1Df0nkGHvXyxUxE"],
  ["Simi_-_Men_Are_Crazy_feat_Tiwa_Savage__Vistanaij.com.ng.mp3", "AHAUCnhmcsc8HlMyYYFOf4g"],
  ["Tekno_-_Jericho_Vistanaij.com.ng.mp3", "AJOySNp55XF91XVPIGh1ZAM"],
  ["Tems_Ft_Asake_-_Get_It_Right.mp3", "AKGEijdFGPUzo1-MGkv-zXc"],
  ["Teni-Jostimilo-feat-Skiibii-(Vistanaij.com).mp3", "ACfjPLSGiaWzzfroVeNB5iU"],
  ["The_Way_of_The_Tears_-_Exclusive_Nasheed_-_Muhammad_al_Muqit(128k).mp3", "ACFFmtWt8vOqyW2z2MDV94A"],
  ["TI_BLAZE_-_Beamer.mp3", "AHQanbt2E6rTgJRh_aC0EVk"],
  ["TI-Blaze-1000-Thoughts-(Vistanaij.com).mp3", "AO7r641PA4X6fXF8u1nHWcU"],
  ["TI-BLAZE-Holy-Fada-feat-Bhadboi-OML-(Vistanaij.com).mp3", "AN3FGkVX-9IKSn1hq-JI26M"],
  ["TI-Blaze-Hope-feat-Tml-Vibez-(Vistanaij.com).mp3", "AKiXqPUVWyTxwPdotBWklyY"],
  ["TI-Blaze-Mario-(Vistanaij.com).mp3", "ABvWyynPBKX7e-WfMU84cAk"],
  ["TI-Blaze-Weed-(Vistanaij.com).mp3", "AFU1oshuxZBMGMQBiNP15fw"],
  ["TI-Blaze-Wonder-(Vistanaij.com).mp3", "AMr7eO6YUg6E7DPr4Rc2xjs"],
  ["Timmy_Ft_Remzel_Zinoleesky_-_Traffic.mp3", "AENH-5XuZslFpEh2fFNy3ls"],
  ["Tml_Vibez_Ft_Seyi_Vibez_-_4ck_Up.mp3", "AEg1UK5lqGqBd5TXbx4q2OY"],
  ["Tml_Vibez_Ft_Seyi_Vibez_-_Where_I_m_From.mp3", "AIrjiPKM4VgEj6kIOtxiOdo"],
  ["Tolibian_-_Journey.mp3", "ACEAvsZrU3Uu4iND2eHLGWM"],
  ["Tolibian_-_Neighbor.mp3", "AB6qt8ul0YRZdIqVPuCZ99Y"],
  ["Tolibian_-_Thuma_Sabila.mp3", "ALBgOtVXtUglOoggiyoaMwE"],
  ["Tolibian_ft_Portable_Sikiru_Ayinde_-_ZaZoo_Zeh_Fuji_Remix_.mp3", "AAht5PkgfJh7aFgRZvM9asE"],
  ["Tolibian_ft_Rexxie_-_Beware_Of_Dog.mp3", "ADJNOFh1C-cZeFkk8vMkisI"],
  ["Tyla_-_Tears.mp3", "ACJuyJzCEpAc8Be9a5PkKrI"],
  ["Victony_-_Anita.mp3", "AJXiCumah52SR3_z6O_DPjs"],
  ["Victony_-_Ba_tard_Don_t_Be_Silly.mp3", "AC1U-6XTtQJLjJujdu7alDU"],
  ["Victony_-_History.mp3", "ABHWExoGJMNdw8FNhM8kk04"],
  ["Victony_Ft_Shallipopi_-_Ludo.mp3", "AHGA6C0bTrJBsAKWBGDM0-E"],
  ["Wizkid_-_A_Million_Blessings.mp3", "AKQtoF4mRcftLw9uk0BHBCA"],
  ["Wizkid_-_Bend.mp3", "AIz3Dcf66qd74JVko-RjgCg"],
  ["Wizkid_-_Break_Me_Down.mp3", "ADK-MSr_rHgDJ1S-TKSe8vQ"],
  ["Wizkid_-_Don_t_Care.mp3", "AIWnjWsoYChgpEwTZMwFBnA"],
  ["Wizkid_-_Karamo.mp3", "ALbI9OLoQetA1y4T8fhJhsc"],
  ["Wizkid_-_Kese_Dance_.mp3", "ANXVVPe7VBe9P0Oa2HKbcUg"],
  ["Wizkid_-_Lose.mp3", "AF_9BlEZuYMKKuede6QhbtA"],
  ["Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij.com.ng.mp3", "AN1RJehjoF8eqkwGk4k9pi0"],
  ["Wizkid_-_Pray.mp3", "ADZtx6IXOkGMFNbZ6Ocq_5o"],
  ["Wizkid_-_Soji.mp3", "AEBKtXcBS1RfZo9NEb8fFfY"],
  ["Wizkid_-_Time.mp3", "AP_rsYwJPNciW1zIRpLPouc"],
  ["Wizkid_-_Troubled_Mind.mp3", "AJui78lzOpfc658F4gVoQ4g"],
  ["Wizkid_Ft_Ana_s_Cardot_-_Slow.mp3", "APR1mqkxXceMIT9ivVMe36E"],
  ["Wizkid_Ft_Asake_-_Bad_Girl.mp3", "AJVqIfJxZyKxjxyAhUeVSwQ"],
  ["Wizkid_Ft_Jazmine_Sullivan_-_Bad_For_You.mp3", "ABFve6aJeC_iF_OrJr0wtwI"],
  ["Wizkid_Ft_Tiakola_-_Apr_s_Minuit.mp3", "AEZamnlzrEvGZ7ksg_j0iTQ"],
  ["Yemi-Alade-Merry-Christmas-O-(Vistanaij.com).mp3", "AF6n6ZdRHy54qG1THNny_oU"],
  ["YKB-Omobanke-(Vistanaij.com).mp3", "AM4h3R5ezRjfx0D_o22Kgd0"],
  ["Zerrydl_Ft_Seyi_Vibez_-_Cash.mp3", "AO9D62Y7-WXCmVoXN7g-yo0"],
  ["Zerrydl-Back-To-Back-(TrendyBeatz.com).mp3", "ABwRpRb_a8rAChVsI6HkDGY"],
  ["Zerrydl-Ft-Tega-boi-dc-Dwillsharmony-Nawa-(TrendyBeatz.com).mp3", "ADdU7FxYNWXuSgYbTQ8Km_w"],
  ["Zerrydl-Pull-Up-(TrendyBeatz.com).mp3", "AOE49bE3g4oG6ML8Wmm0rqw"],
  ["Zerrydl-Today-(TrendyBeatz.com).mp3", "AAHzLVT_ECHzIUcha66dtKU"],
  ["ZIKIRUL_HAWLIYAH_by_Adhakir_Faozu_Zaman__feat._Roheesu_Dhakireen_(128k).mp3", "AN69Qhr8TfEYePSIItgqaDA"],
  ["Zinoleesky_-_Element.mp3", "ANH-f7Oi7lGgZdukmgPEL68"],
  ["Zlatan_Ft_Asake_-_Bust_Down.mp3", "AJsIajY8QgKu217AL4D-pcc"],
  ["Zyno-TopBoy-Ozo-(Vistanaij.com).mp3", "AEukEfNZ1JOasyFviNJ3XKg"],
]

const tracks = dropboxFiles.map(([title, fileId], index) => ({
  id: index + 21,
  title,
  artist: "Your Music Library",
  length: "—",
  cover: [
    "/media/travel-desk.jpg",
    "/media/coast.jpg",
    "/media/flight.jpg",
    "/media/balloons.jpg",
    "/media/kyoto.jpg",
    "/media/lakeside.jpg",
    "/media/waterfall.jpg",
    "/media/memories.jpg",
  ][index % 8],
  color: ["#dff4ef", "#e7efff", "#fff0df", "#f8e4d5"][index % 4],
  src: `${dropboxFolderUrl}/${fileId}/${encodeURIComponent(title)}?rlkey=${dropboxFolderKey}&raw=1`,
}))

function shuffleTracks(items: typeof tracks) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }
  return shuffled
}

const quickPicks = shuffleTracks(tracks).slice(0, 6)

function getTrackArtist(title: string) {
  const stem = title.replace(/\.[^.]+$/, "")
  const artist = stem
    .replace(/_/g, " ")
    .split(/\s+[-–]\s+/)[0]
    .replace(/\b(?:ft|feat)\.?\b.*$/i, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return artist && !/^\d+$/.test(artist) ? artist : null
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function formatMediaSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** unitIndex
  return `${value.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

type PreviewItem = {
  type: "image" | "video"
  title: string
  src: string
  poster?: string
  id?: number
  kind?: "photo" | "video"
}

type Preview = PreviewItem & { items?: PreviewItem[]; index?: number } | null

function createPhotoQueue(items: PhotoItem[]): PreviewItem[] {
  return items.map((photo) => ({
    type: "image",
    title: photo.title,
    src: photo.src,
    id: photo.id,
    kind: "photo",
  }))
}

function createVideoQueue(items: VideoItem[]): PreviewItem[] {
  return items.map((video) => ({
    type: "video",
    title: video.title,
    src: video.src,
    poster: video.poster,
    id: video.id,
    kind: "video",
  }))
}

function isMediaManifest(value: unknown): value is MediaManifest {
  if (!value || typeof value !== "object") return false
  const manifest = value as Partial<MediaManifest>
  return (
    Array.isArray(manifest.photos) &&
    Array.isArray(manifest.videos) &&
    manifest.photos.every(
      (item) =>
        item &&
        Number.isSafeInteger(item.id) &&
        typeof item.title === "string" &&
        typeof item.meta === "string" &&
        typeof item.src === "string",
    ) &&
    manifest.videos.every(
      (item) =>
        item &&
        Number.isSafeInteger(item.id) &&
        typeof item.title === "string" &&
        typeof item.meta === "string" &&
        typeof item.src === "string" &&
        typeof item.poster === "string",
    )
  )
}

function PageSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="library-search">
      <Icon name="search" size={20} />
      <input
        id="page-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search">
          <Icon name="x" size={17} />
        </button>
      )}
    </label>
  )
}

function LibraryHero({
  eyebrow,
  title,
  copy,
  query,
  setQuery,
  placeholder,
}: {
  eyebrow: string
  title: string
  copy: string
  query: string
  setQuery: (value: string) => void
  placeholder: string
}) {
  return (
    <section className="library-hero">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <PageSearch value={query} onChange={setQuery} placeholder={placeholder} />
    </section>
  )
}

function PhotosPage({
  photos,
  open,
  favorites,
  toggleFavorite,
  share,
}: {
  photos: PhotoItem[]
  open: (index: number) => void
  favorites: number[]
  toggleFavorite: (id: number) => void
  share: (kind: string, id: number, title: string) => void
}) {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const [visiblePhotoCount, setVisiblePhotoCount] = useState(60)
  const results = photos.filter((photo) =>
    `${photo.title} ${photo.meta}`.toLowerCase().includes(query.toLowerCase()),
  )
  const featured = photos[0]
  if (!featured) {
    return (
      <main className="cinema-page photo-cinema">
        <div className="cinema-top">
          <div>
            <span className="eyebrow">Techzilla Photos</span>
            <h1>Your memories</h1>
            <p>Every person, place, and moment—beautifully brought together.</p>
          </div>
        </div>
        <section className="cinema-results">
          <LibraryEmpty query={query} type="photos" />
        </section>
      </main>
    )
  }
  const photoAt = (index: number) => photos[index % photos.length] ?? featured
  const people = [
    { label: "All", image: photoAt(3).src },
    { label: "Me", image: photoAt(5).src },
    { label: "Family", image: photoAt(1).src },
    { label: "Friends", image: photoAt(4).src },
    { label: "Favorites", image: photoAt(0).src },
    { label: "Places", image: photoAt(2).src },
  ]

  return (
    <main className="cinema-page photo-cinema">
      <div className="cinema-top">
        <div>
          <span className="eyebrow">Techzilla Photos</span>
          <h1>Your memories</h1>
          <p>Every person, place, and moment—beautifully brought together.</p>
        </div>
        <PageSearch
          value={query}
          onChange={setQuery}
          placeholder="Search photos, people, or places"
        />
      </div>

      {query ? (
        <section className="cinema-results">
          <div className="cinema-section-title">
            <div>
              <h2>Search results</h2>
              <p>
                {results.length} memories found for “{query}”
              </p>
            </div>
          </div>
          {results.length ? (
            <>
              <div className="cinema-search-grid photo-search-results">
                {results.slice(0, visiblePhotoCount).map((photo) => (
                  <PhotoShelfCard
                    key={photo.id}
                    photo={photo}
                    photos={photos}
                    open={open}
                    share={share}
                    favorite={favorites.includes(photo.id)}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
              {results.length > visiblePhotoCount && (
                <button
                  className="secondary-button"
                  onClick={() => setVisiblePhotoCount((count) => count + 60)}
                >
                  Load more photos
                </button>
              )}
            </>
          ) : (
            <LibraryEmpty query={query} type="photos" />
          )}
        </section>
      ) : (
        <>
          <section
            className="cinema-feature photo-feature"
            style={{ backgroundImage: `url(${featured.src})` }}
          >
            <div className="cinema-feature-copy">
              <span>Featured memory</span>
              <h2>{featured.title}</h2>
              <p>
                Rediscover one of your favorite moments from your photo
                collection.
              </p>
              <div>
                <button className="feature-primary" onClick={() => open(0)}>
                  <Icon name="image" size={18} /> View memory
                </button>
                <button
                  className="feature-secondary"
                  onClick={() => share("photo", featured.id, featured.title)}
                >
                  <Icon name="share" size={18} /> Share
                </button>
              </div>
            </div>
          </section>

          <section className="people-section cinema-width">
            <div className="cinema-section-title">
              <div>
                <h2>Browse your photos</h2>
                <p>Explore everything or jump to a familiar face</p>
              </div>
            </div>
            <div className="people-row">
              {people.map((person, index) => (
                <button
                  key={person.label}
                  onClick={() => open(index % photos.length)}
                >
                  <span>
                    <img src={person.image} alt="" />
                  </span>
                  <b>{person.label}</b>
                  <small>
                    {[photos.length, 328, 184, 96, favorites.length, 42][index]}{" "}
                    photos
                  </small>
                </button>
              ))}
            </div>
          </section>

          {showAll ? (
            <section className="cinema-results all-photo-results">
              <div className="cinema-section-title">
                <div>
                  <h2>All photos</h2>
                  <p>{photos.length} photos in your library</p>
                </div>
                <button onClick={() => setShowAll(false)}>
                  Back to collections
                </button>
              </div>
              <div className="cinema-search-grid photo-search-results">
                {photos.slice(0, visiblePhotoCount).map((photo) => (
                  <PhotoShelfCard
                    key={photo.id}
                    photo={photo}
                    photos={photos}
                    open={open}
                    share={share}
                    favorite={favorites.includes(photo.id)}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
              {photos.length > visiblePhotoCount && (
                <button
                  className="secondary-button"
                  onClick={() => setVisiblePhotoCount((count) => count + 60)}
                >
                  Load more photos
                </button>
              )}
            </section>
          ) : (
            <>
              <PhotoShelf
                title="Made with you"
                subtitle="Highlights created from your best moments"
                items={photos.slice(0, 5)}
                open={open}
                share={share}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                photos={photos}
                onSeeAll={() => setShowAll(true)}
              />
              <PhotoShelf
                title="Family stories"
                subtitle="The people you come home to"
                items={[photoAt(1), photoAt(4), photoAt(0), photoAt(2), photoAt(5)]}
                open={open}
                share={share}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                photos={photos}
              />
              <PhotoShelf
                title="Adventures"
                subtitle="Trips, weekends, and places worth remembering"
                items={[photoAt(2), photoAt(4), photoAt(5), photoAt(0), photoAt(3)]}
                open={open}
                share={share}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                photos={photos}
                last
              />
            </>
          )}
        </>
      )}
    </main>
  )
}

function PhotoShelf({
  title,
  subtitle,
  items,
  photos,
  open,
  share,
  favorites,
  toggleFavorite,
  onSeeAll,
  last = false,
}: {
  title: string
  subtitle: string
  items: typeof photos
  photos: PhotoItem[]
  open: (index: number) => void
  share: (kind: string, id: number, title: string) => void
  favorites: number[]
  toggleFavorite: (id: number) => void
  onSeeAll?: () => void
  last?: boolean
}) {
  return (
    <section className={`cinema-shelf cinema-width ${last ? "last" : ""}`}>
      <div className="cinema-section-title">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button onClick={onSeeAll}>
          See all <Icon name="arrow" size={17} />
        </button>
      </div>
      <div className="photo-poster-row">
        {items.map((photo) => (
          <PhotoShelfCard
            key={`${title}-${photo.id}`}
            photo={photo}
            photos={photos}
            open={open}
            share={share}
            favorite={favorites.includes(photo.id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}

function PhotoShelfCard({
  photo,
  photos,
  open,
  share,
  favorite,
  toggleFavorite,
}: {
  photo: typeof photos[number]
  photos: PhotoItem[]
  open: (index: number) => void
  share: (kind: string, id: number, title: string) => void
  favorite: boolean
  toggleFavorite: (id: number) => void
}) {
  const index = photos.findIndex((item) => item.id === photo.id)
  return (
    <article className="photo-poster">
      <button className="poster-image" onClick={() => open(index)}>
        <img src={photo.src} alt={photo.title} />
        <span>
          <Icon name="image" size={18} /> Open
        </span>
      </button>
      <div className="poster-meta">
        <span>
          <b>{photo.title}</b>
          <small>{photo.meta}</small>
        </span>
        <div>
          <button
            className={favorite ? "active" : ""}
            onClick={() => toggleFavorite(photo.id)}
            aria-label={`Favorite ${photo.title}`}
          >
            <Icon name="heart" size={17} filled={favorite} />
          </button>
          <button
            onClick={() => share("photo", photo.id, photo.title)}
            aria-label={`Share ${photo.title}`}
          >
            <Icon name="share" size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}

function VideosPage({
  videos,
  open,
  share,
}: {
  videos: VideoItem[]
  open: (index: number) => void
  share: (kind: string, id: number, title: string) => void
}) {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const [visibleVideoCount, setVisibleVideoCount] = useState(60)
  const results = videos.filter((video) =>
    `${video.title} ${video.meta}`.toLowerCase().includes(query.toLowerCase()),
  )
  const featured = videos[0]

  if (!featured) {
    return (
      <main className="cinema-page video-cinema">
        <div className="cinema-top">
          <div>
            <span className="eyebrow">Techzilla Cinema</span>
            <h1>Watch your stories</h1>
            <p>A private cinema made from your video collection.</p>
          </div>
        </div>
        <section className="cinema-results">
          <LibraryEmpty query={query} type="videos" />
        </section>
      </main>
    )
  }

  return (
    <main className="cinema-page video-cinema">
      <div className="cinema-top">
        <div>
          <span className="eyebrow">Techzilla Cinema</span>
          <h1>Watch your stories</h1>
          <p>
            A private cinema made from every clip saved across your devices.
          </p>
        </div>
        <PageSearch
          value={query}
          onChange={setQuery}
          placeholder="Search videos, moments, or dates"
        />
      </div>

      {query ? (
        <section className="cinema-results">
          <div className="cinema-section-title">
            <div>
              <h2>Search results</h2>
              <p>
                {results.length} videos found for “{query}”
              </p>
            </div>
          </div>
          {results.length ? (
            <>
              <div className="cinema-search-grid">
                {results.slice(0, visibleVideoCount).map((video) => (
                  <VideoShelfCard
                    key={video.id}
                    video={video}
                    videos={videos}
                    open={open}
                    share={share}
                  />
                ))}
              </div>
              {results.length > visibleVideoCount && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    setVisibleVideoCount((count) => count + 60)
                  }
                >
                  Load more videos
                </button>
              )}
            </>
          ) : (
            <LibraryEmpty query={query} type="videos" />
          )}
        </section>
      ) : showAll ? (
        <section className="cinema-results all-video-results">
          <div className="cinema-section-title">
            <div>
              <h2>All videos</h2>
              <p>Every video in your cloud, newest to oldest</p>
            </div>
            <button onClick={() => setShowAll(false)}>
              Back to collections
            </button>
          </div>
          <div className="cinema-search-grid">
            {[...videos]
              .reverse()
              .slice(0, visibleVideoCount)
              .map((video) => (
                <VideoShelfCard
                  key={`all-${video.id}`}
                  video={video}
                  videos={videos}
                  open={open}
                  share={share}
                />
              ))}
          </div>
          {videos.length > visibleVideoCount && (
            <button
              className="secondary-button"
              onClick={() => setVisibleVideoCount((count) => count + 60)}
            >
              Load more videos
            </button>
          )}
        </section>
      ) : (
        <>
          <section
            className="cinema-feature video-cinema-feature"
            style={{ backgroundImage: `url(${featured.poster})` }}
          >
            <div className="cinema-feature-copy">
              <span>Featured film</span>
              <h2>{featured.title}</h2>
              <p>
                Relive one of your favorite moments from your video collection.
              </p>
              <div>
                <button className="feature-primary" onClick={() => open(0)}>
                  <Icon name="play" size={18} /> Play film
                </button>
                <button
                  className="feature-secondary"
                  onClick={() => share("video", featured.id, featured.title)}
                >
                  <Icon name="share" size={18} /> Share
                </button>
              </div>
            </div>
          </section>

          <VideoShelf
            title="Continue watching"
            subtitle="Pick up where you left off"
            items={videos.slice(0, 5)}
            videos={videos}
            open={open}
            share={share}
            progress
          />
          <VideoShelf
            title="Travel stories"
            subtitle="Your journeys, beautifully recut"
            items={[
              videos[5 % videos.length],
              videos[1 % videos.length],
              videos[2 % videos.length],
              videos[4 % videos.length],
              videos[3 % videos.length],
            ]}
            videos={videos}
            open={open}
            share={share}
          />
          <VideoShelf
            title="Family & friends"
            subtitle="The moments everyone keeps talking about"
            items={[
              videos[1 % videos.length],
              videos[4 % videos.length],
              videos[0],
              videos[2 % videos.length],
              videos[5 % videos.length],
            ]}
            videos={videos}
            open={open}
            share={share}
          />
          <VideoShelf
            title="Recently added"
            subtitle="Fresh from your connected devices"
            items={[
              videos[3 % videos.length],
              videos[5 % videos.length],
              videos[2 % videos.length],
              videos[1 % videos.length],
              videos[4 % videos.length],
            ]}
            videos={videos}
            open={open}
            share={share}
            onSeeAll={() => setShowAll(true)}
            last
          />
        </>
      )}
    </main>
  )
}

function VideoShelf({
  title,
  subtitle,
  items,
  videos,
  open,
  share,
  progress = false,
  last = false,
  onSeeAll,
}: {
  title: string
  subtitle: string
  items: typeof videos
  videos: VideoItem[]
  open: (index: number) => void
  share: (kind: string, id: number, title: string) => void
  progress?: boolean
  last?: boolean
  onSeeAll?: () => void
}) {
  return (
    <section className={`cinema-shelf cinema-width ${last ? "last" : ""}`}>
      <div className="cinema-section-title">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button onClick={onSeeAll}>
          See all <Icon name="arrow" size={17} />
        </button>
      </div>
      <div className="video-poster-row">
        {items.map((video, index) => (
          <VideoShelfCard
            key={`${title}-${video.id}`}
            video={video}
            videos={videos}
            open={open}
            share={share}
            progress={progress ? 24 + index * 13 : undefined}
          />
        ))}
      </div>
    </section>
  )
}

function VideoShelfCard({
  video,
  videos,
  open,
  share,
  progress,
}: {
  video: typeof videos[number]
  videos: VideoItem[]
  open: (index: number) => void
  share: (kind: string, id: number, title: string) => void
  progress?: number
}) {
  const index = videos.findIndex((item) => item.id === video.id)
  return (
    <article className="video-poster">
      <button className="video-poster-image" onClick={() => open(index)}>
        <img src={video.poster} alt="" />
        <i>
          <Icon name="play" size={18} />
        </i>
        {progress && (
          <span className="watch-progress">
            <b style={{ width: `${progress}%` }} />
          </span>
        )}
      </button>
      <div className="poster-meta">
        <span>
          <b>{video.title}</b>
          <small>{video.meta}</small>
        </span>
        <div>
          <button
            onClick={() => share("video", video.id, video.title)}
            aria-label={`Share ${video.title}`}
          >
            <Icon name="share" size={17} />
          </button>
          <a href={video.src} download aria-label={`Download ${video.title}`}>
            <Icon name="download" size={17} />
          </a>
        </div>
      </div>
    </article>
  )
}

function LibraryEmpty({ query, type }: { query: string; type: string }) {
  return (
    <div className="library-empty">
      <span>
        <Icon name="search" size={30} />
      </span>
      <h3>No {type} found</h3>
      <p>
        We couldn’t find anything matching “{query}”. Try another title or
        keyword.
      </p>
    </div>
  )
}

function MusicPage({
  tracks,
  playing,
  isPlaying,
  toggleTrack,
  playQueue,
  share,
}: {
  tracks: typeof tracks
  playing: number | null
  isPlaying: boolean
  toggleTrack: (id: number, queue?: typeof tracks) => void
  playQueue: (queue: typeof tracks) => void
  share: (kind: string, id: number, title: string) => void
}) {
  const [query, setQuery] = useState("")
  const results = tracks.filter((track) =>
    `${track.title} ${track.artist}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const featured = tracks[3]
  const albums = useMemo(() => {
    const byArtist = new Map<string, typeof tracks>()
    tracks.forEach((track) => {
      const artist = getTrackArtist(track.title)
      if (!artist) return
      byArtist.set(artist, [...(byArtist.get(artist) ?? []), track])
    })
    return [...byArtist.entries()]
      .filter(([, songs]) => songs.length > 1)
      .sort((first, second) => second[1].length - first[1].length)
      .slice(0, 5)
  }, [tracks])

  return (
    <main className="music-page">
      <div className="music-page-head">
        <div className="music-page-greeting">
          <span className="eyebrow">Techzilla Music</span>
          <h1>Listen again</h1>
          <p>Made for your moments, available on every device.</p>
        </div>
        <PageSearch
          value={query}
          onChange={setQuery}
          placeholder="Search songs or artists"
        />
      </div>

      {query ? (
        <section className="music-results">
          <div className="library-title-row">
            <div>
              <h2>Search results</h2>
              <span>
                {results.length} songs found for “{query}”
              </span>
            </div>
          </div>
          {results.length ? (
            <div className="music-search-list">
              {results.map((track, index) => (
                <MusicRow
                  key={track.id}
                  track={track}
                  index={index}
                  playing={playing}
                  isPlaying={isPlaying}
                  toggleTrack={toggleTrack}
                  share={share}
                />
              ))}
            </div>
          ) : (
            <LibraryEmpty query={query} type="songs" />
          )}
        </section>
      ) : (
        <>
          <section className="music-feature">
            <img src={featured.cover} alt="" />
            <div>
              <span>Featured mix</span>
              <h2>Cloud Sessions</h2>
              <p>Warm, spacious sounds for slow mornings and long journeys.</p>
              <button
                className="music-play-all"
                onClick={() => playQueue(shuffleTracks(tracks))}
              >
                <Icon name="play" size={19} />
                Play mix
              </button>
            </div>
          </section>
          <section className="music-shelf">
            <div className="music-shelf-title">
              <div>
                <h2>Quick picks</h2>
                <p>Start a radio from a song</p>
              </div>
            </div>
            <div className="music-quick-grid">
              {quickPicks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => toggleTrack(track.id)}
                  className={playing === track.id ? "active" : ""}
                >
                  <img src={track.cover} alt="" />
                  <span>
                    <b>{track.title}</b>
                    <small>{track.artist}</small>
                  </span>
                  <i>
                    <Icon
                      name={
                        playing === track.id && isPlaying ? "pause" : "play"
                      }
                      size={15}
                    />
                  </i>
                </button>
              ))}
            </div>
          </section>
          <section className="music-shelf">
            <div className="music-shelf-title">
              <div>
                <h2>Albums for you</h2>
                <p>Inspired by your library</p>
              </div>
            </div>
            <div className="album-grid">
              {albums.map(([artist, songs]) => (
                <button
                  key={artist}
                  onClick={() => playQueue(songs)}
                >
                  <span className="album-art">
                    <img src={songs[0].cover} alt="" />
                    <i>
                      <Icon name="play" />
                    </i>
                  </span>
                  <b>{artist} collection</b>
                  <small>{artist} · {songs.length} songs</small>
                </button>
              ))}
            </div>
          </section>
          <section className="music-shelf last-shelf">
            <div className="music-shelf-title">
              <div>
                <h2>From your library</h2>
                <p>All available songs</p>
              </div>
            </div>
            <div className="music-search-list">
              {tracks.map((track, index) => (
                <MusicRow
                  key={track.id}
                  track={track}
                  index={index}
                  playing={playing}
                  isPlaying={isPlaying}
                  toggleTrack={toggleTrack}
                  share={share}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}

function MusicRow({
  track,
  index,
  playing,
  isPlaying,
  toggleTrack,
  share,
}: {
  track: typeof tracks[number]
  index: number
  playing: number | null
  isPlaying: boolean
  toggleTrack: (id: number) => void
  share: (kind: string, id: number, title: string) => void
}) {
  return (
    <article
      className={playing === track.id ? "music-row active" : "music-row"}
    >
      <span className="music-index">
        {playing === track.id ? <Icon name="music" size={16} /> : index + 1}
      </span>
      <button className="music-row-cover" onClick={() => toggleTrack(track.id)}>
        <img src={track.cover} alt="" />
        <i>
          <Icon
            name={playing === track.id && isPlaying ? "pause" : "play"}
            size={14}
          />
        </i>
      </button>
      <span>
        <b>{track.title}</b>
        <small>{track.artist}</small>
      </span>
      <span className="music-row-album">Techzilla Cloud Sessions</span>
      <span className="music-row-time">{track.length}</span>
      <a href={track.src} download={track.title}>
        <Icon name="download" size={18} />
      </a>
      <button
        className="music-row-share"
        onClick={() => share("music", track.id, track.title)}
        aria-label={`Share ${track.title}`}
      >
        <Icon name="share" size={18} />
      </button>
    </article>
  )
}

export default function App() {
  const [active, setActive] = useState(() => {
    const page = window.location.hash.slice(1).toLowerCase()
    return page ? `${page[0].toUpperCase()}${page.slice(1)}` : "Home"
  })
  const [query, setQuery] = useState("")
  const [preview, setPreview] = useState<Preview>(null)
  const [favorites, setFavorites] = useState<number[]>([1, 4])
  const [libraryPhotos, setLibraryPhotos] = useState(photos)
  const [libraryVideos, setLibraryVideos] = useState(videos)
  const [hasImportedCatalog, setHasImportedCatalog] = useState(false)
  const [playing, setPlaying] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareNotice, setShareNotice] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const playbackQueue = useRef(tracks)
  const playbackIndex = useRef(-1)
  const handledSharedFile = useRef<string | null>(null)
  const photoQueue = useMemo(
    () => createPhotoQueue(libraryPhotos),
    [libraryPhotos],
  )
  const videoQueue = useMemo(
    () => createVideoQueue(libraryVideos),
    [libraryVideos],
  )

  useEffect(() => {
    let active = true
    fetch("/media-library.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status !== 404)
            throw new Error(`Media catalog request failed: ${response.status}`)
          return null
        }
        const value: unknown = await response.json()
        if (!isMediaManifest(value))
          throw new Error("Media catalog has an invalid format")
        return value
      })
      .then((manifest) => {
        if (!active || !manifest) return
        if (manifest.updatedAt) {
          setLibraryPhotos(manifest.photos)
          setLibraryVideos(manifest.videos)
          setHasImportedCatalog(true)
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load imported media catalog:", error)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const syncPage = () => {
      const page = window.location.hash.slice(1).toLowerCase()
      setActive(page ? `${page[0].toUpperCase()}${page.slice(1)}` : "Home")
      window.scrollTo({ top: 0 })
    }
    window.addEventListener("hashchange", syncPage)
    return () => window.removeEventListener("hashchange", syncPage)
  }, [])

  const filteredPhotos = useMemo(
    () =>
      libraryPhotos.filter((photo) =>
        photo.title.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 6),
    [libraryPhotos, query],
  )

  const current = tracks.find((track) => track.id === playing)
  const photoBytes = libraryPhotos.reduce(
    (total, photo) => total + (photo.size ?? 0),
    0,
  )
  const videoBytes = libraryVideos.reduce(
    (total, video) => total + (video.size ?? 0),
    0,
  )
  const mediaBytes = photoBytes + videoBytes
  const photoShare = mediaBytes
    ? Math.round((photoBytes / mediaBytes) * 100)
    : 0

  const startTrack = (track: typeof tracks[number], queue: typeof tracks) => {
    if (!audioRef.current) return
    const index = queue.findIndex((item) => item.id === track.id)
    if (index < 0) return
    playbackQueue.current = queue
    playbackIndex.current = index
    audioRef.current.src = track.src
    audioRef.current.load()
    audioRef.current.play().catch((error) => {
      if (
        audioRef.current?.src !== track.src ||
        (error instanceof DOMException &&
          error.name === "AbortError" &&
          audioRef.current.paused)
      ) {
        return
      }
      console.error("Audio play failed:", error)
      setIsPlaying(false)
    })
    setCurrentTime(0)
    setDuration(0)
    setPlaying(track.id)
  }

  const toggleTrack = (id: number, queue: typeof tracks = tracks) => {
    const track = tracks.find((item) => item.id === id)
    if (playing === id) {
      if (!audioRef.current) return
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          if (
            audioRef.current?.src !== track.src ||
            (error instanceof DOMException &&
              error.name === "AbortError" &&
              audioRef.current.paused)
          ) {
            return
          }
          console.error("Audio play failed:", error)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    } else if (track) {
      startTrack(track, queue)
    }
  }

  const playQueue = (queue: typeof tracks) => {
    if (queue[0]) startTrack(queue[0], queue)
  }

  const changeTrack = (direction: number) => {
    const queue = playbackQueue.current
    if (!queue.length) return
    const nextIndex =
      playbackIndex.current < 0
        ? 0
        : (playbackIndex.current + direction + queue.length) % queue.length
    startTrack(queue[nextIndex], queue)
  }

  const toggleFavorite = (id: number) =>
    setFavorites((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    )

  const openPreview = (items: PreviewItem[], index: number) => {
    const item = items[index]
    setPreview({ ...item, items, index })
  }

  const movePreview = (direction: number) => {
    if (!preview?.items?.length) return
    const currentIndex = preview.index ?? 0
    const nextIndex =
      (currentIndex + direction + preview.items.length) % preview.items.length
    const next = preview.items[nextIndex]
    setPreview({ ...next, items: preview.items, index: nextIndex })
  }

  useEffect(() => {
    const sharedFile = new URLSearchParams(window.location.search).get("file")
    if (!sharedFile || handledSharedFile.current === sharedFile) return
    const match = /^(photo|video|music)-(\d+)$/.exec(sharedFile)
    if (!match) return
    const [, kind, rawId] = match
    const id = Number(rawId)
    if (kind === "photo" && active === "Photos") {
      const index = libraryPhotos.findIndex((photo) => photo.id === id)
      if (index >= 0) {
        openPreview(photoQueue, index)
        handledSharedFile.current = sharedFile
      }
    } else if (kind === "video" && active === "Videos") {
      const index = libraryVideos.findIndex((video) => video.id === id)
      if (index >= 0) {
        openPreview(videoQueue, index)
        handledSharedFile.current = sharedFile
      }
    } else if (kind === "music" && active === "Music") {
      const track = tracks.find((item) => item.id === id)
      if (track) {
        startTrack(track, tracks)
        handledSharedFile.current = sharedFile
      }
    }
  }, [active, libraryPhotos, libraryVideos])

  const navigate = (item: string) => {
    setActive(item)
    setMenuOpen(false)
    const nextHash = item === "Home" ? "" : item.toLowerCase()
    if (window.location.hash.slice(1) !== nextHash)
      window.location.hash = nextHash
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const shareMedia = async (kind: string, id: number, title: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("file", `${kind}-${id}`)
    url.hash =
      kind === "photo" ? "photos" : kind === "video" ? "videos" : "music"
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(url.toString())
      } catch {
        const field = document.createElement("textarea")
        field.value = url.toString()
        field.style.position = "fixed"
        field.style.opacity = "0"
        document.body.appendChild(field)
        field.select()
        document.execCommand("copy")
        field.remove()
      }
      setShareNotice("Link copied to clipboard")
      window.setTimeout(() => setShareNotice(""), 2200)
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `View “${title}” in Techzilla Cloud`,
          url: url.toString(),
        })
      } else {
        await copyLink()
      }
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "AbortError")
        await copyLink()
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="mobile-menu icon-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Icon name="menu" />
        </button>
        <a
          className="brand"
          href="#"
          onClick={() => navigate("Home")}
          aria-label="Techzilla Cloud home"
        >
          <span className="brand-cube">
            <i />
            <b />
            <em />
          </span>
          <span>
            Techzilla <strong>Cloud</strong>
          </span>
        </a>

        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          {["Home", "Photos", "Videos", "Music"].map((item) => (
            <button
              key={item}
              className={active === item ? "active" : ""}
              onClick={() => navigate(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search"
            onClick={() =>
              document
                .getElementById(active === "Home" ? "search" : "page-search")
                ?.focus()
            }
          >
            <Icon name="search" />
          </button>
          <button className="icon-button hide-mobile" aria-label="Settings">
            <Icon name="settings" />
          </button>
          <button className="avatar" aria-label="Open profile">
            TZ
            <span className="online-dot" />
          </button>
        </div>
      </header>

      {active !== "Home" &&
        (active === "Photos" ? (
          <PhotosPage
            photos={libraryPhotos}
            open={(index) => openPreview(photoQueue, index)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            share={shareMedia}
          />
        ) : active === "Videos" ? (
          <VideosPage
            videos={libraryVideos}
            open={(index) => openPreview(videoQueue, index)}
            share={shareMedia}
          />
        ) : (
          <MusicPage
            tracks={tracks}
            playing={playing}
            isPlaying={isPlaying}
            toggleTrack={toggleTrack}
            playQueue={playQueue}
            share={shareMedia}
          />
        ))}

      <main className={active === "Home" ? "" : "home-hidden"}>
        <section className="hero">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="hero-copy">
            <span className="eyebrow">
              <Icon name="sparkles" size={16} /> Your world, safely together
            </span>
            <h1>
              Every memory.
              <br />
              <em>One beautiful cloud.</em>
            </h1>
            <p>
              Photos, videos, and music from all your devices—organized,
              protected, and ready whenever you are.
            </p>
            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => navigate("Photos")}
              >
                Explore your cloud <Icon name="arrow" />
              </button>
              <button className="text-button">
                <span className="mini-play">
                  <Icon name="play" size={14} />
                </span>{" "}
                See how it works
              </button>
            </div>
            <div className="sync-note">
              <span>
                <Icon name="check" size={13} />
              </span>{" "}
              All devices synced 2 minutes ago
            </div>
          </div>

          <div
            className="cloud-scene"
            aria-label="Your connected cloud storage"
          >
            <div className="floating-chip chip-photo">
              <span>
                <Icon name="image" />
              </span>
              <div>
                <b>{libraryPhotos.length.toLocaleString()}</b>
                <small>Photos</small>
              </div>
            </div>
            <div className="floating-chip chip-music">
              <span>
                <Icon name="music" />
              </span>
              <div>
                <b>{tracks.length.toLocaleString()}</b>
                <small>Songs</small>
              </div>
            </div>
            <div className="cloud-card">
              <div className="cloud-illustration">
                <span className="cloud-shadow" />
                <Icon name="cloud" size={102} />
                <i className="float-file file-one">
                  <Icon name="image" size={18} />
                </i>
                <i className="float-file file-two">
                  <Icon name="music" size={18} />
                </i>
                <i className="float-file file-three">
                  <Icon name="video" size={18} />
                </i>
              </div>
              <div className="storage-label">
                <span>Media library</span>
                <strong>
                  {hasImportedCatalog ? formatMediaSize(mediaBytes) : "Not imported"}
                </strong>
              </div>
              <div className="storage-track">
                <i style={{ width: `${photoShare}%` }} />
              </div>
              <small>
                {hasImportedCatalog
                  ? `${libraryPhotos.length + libraryVideos.length} photos and videos`
                  : "Import a Takeout catalog to see your media"}
              </small>
            </div>
            <div className="floating-chip chip-video">
              <span>
                <Icon name="video" />
              </span>
              <div>
                <b>{libraryVideos.length.toLocaleString()}</b>
                <small>Videos</small>
              </div>
            </div>
          </div>
        </section>

        <section className="overview section-wrap">
          <div className="section-heading centered">
            <span className="eyebrow">Your library at a glance</span>
            <h2>Everything you love, beautifully organized</h2>
          </div>
          <div className="overview-grid">
            {[
              {
                label: "Photos",
                count: libraryPhotos.length.toLocaleString(),
                detail: hasImportedCatalog
                  ? formatMediaSize(photoBytes)
                  : "Photos",
                icon: "image" as IconName,
                color: "mint",
                id: "photos",
              },
              {
                label: "Videos",
                count: libraryVideos.length.toLocaleString(),
                detail: hasImportedCatalog
                  ? formatMediaSize(videoBytes)
                  : "Videos",
                icon: "video" as IconName,
                color: "blue",
                id: "videos",
              },
              {
                label: "Music",
                count: tracks.length.toLocaleString(),
                detail: "Tracks",
                icon: "music" as IconName,
                color: "lilac",
                id: "music",
              },
            ].map((item) => (
              <button
                className={`overview-card ${item.color}`}
                key={item.label}
                onClick={() => navigate(item.label)}
              >
                <span className="three-d-icon">
                  <Icon name={item.icon} size={30} />
                </span>
                <span className="overview-content">
                  <small>{item.label}</small>
                  <b>{item.count}</b>
                  <em>{item.detail}</em>
                </span>
                <span className="round-arrow">
                  <Icon name="chevron" size={18} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="photo-section section-wrap" id="photos">
          <div className="section-heading row-heading">
            <div>
              <span className="eyebrow">Fresh from your devices</span>
              <h2>Recent memories</h2>
            </div>
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your memories"
                aria-label="Search memories"
              />
            </div>
          </div>
          <div className="photo-grid">
            {filteredPhotos.map((photo, index) => (
              <article
                className={`photo-card photo-${index + 1}`}
                key={photo.id}
              >
                <button
                  className="photo-open"
                  onClick={() => openPreview(photoQueue, index)}
                >
                  <img src={photo.src} alt={photo.title} />
                </button>
                <div className="photo-overlay">
                  <div>
                    <b>{photo.title}</b>
                    <small>{photo.meta}</small>
                  </div>
                  <div className="photo-actions">
                    <button
                      onClick={() => shareMedia("photo", photo.id, photo.title)}
                      aria-label={`Share ${photo.title}`}
                      className="favorite"
                    >
                      <Icon name="share" size={18} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(photo.id)}
                      aria-label={`Favorite ${photo.title}`}
                      className={
                        favorites.includes(photo.id)
                          ? "favorite active"
                          : "favorite"
                      }
                    >
                      <Icon
                        name="heart"
                        size={19}
                        filled={favorites.includes(photo.id)}
                      />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {filteredPhotos.length === 0 && (
              <div className="empty-state">No memories match “{query}”.</div>
            )}
          </div>
          <button
            className="secondary-button"
            onClick={() => navigate("Photos")}
          >
            View all photos <Icon name="arrow" />
          </button>
        </section>

        <section className="video-section" id="videos">
          <div className="section-wrap">
            <div className="section-heading row-heading">
              <div>
                <span className="eyebrow light">Stories in motion</span>
                <h2>Watch it all again</h2>
              </div>
              <button
                className="outline-light"
                onClick={() => navigate("Videos")}
              >
                Browse all videos <Icon name="arrow" />
              </button>
            </div>
            <div className="video-grid">
              {libraryVideos.slice(0, 3).map((video, index) => (
                <article className="video-card" key={video.id}>
                  <img src={video.poster} alt="" />
                  <button
                    className="video-play"
                    onClick={() => openPreview(videoQueue, index)}
                    aria-label={`Play ${video.title}`}
                  >
                    <Icon name="play" size={index === 0 ? 26 : 20} />
                  </button>
                  <div className="video-details">
                    <div>
                      <b>{video.title}</b>
                      <small>{video.meta}</small>
                    </div>
                    <div className="video-card-actions">
                      <button
                        onClick={() =>
                          shareMedia("video", video.id, video.title)
                        }
                        aria-label={`Share ${video.title}`}
                      >
                        <Icon name="share" size={19} />
                      </button>
                      <a
                        href={video.src}
                        download
                        aria-label={`Download ${video.title}`}
                      >
                        <Icon name="download" size={19} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="music-section section-wrap" id="music">
          <div className="music-intro">
            <span className="eyebrow">Your soundtrack, everywhere</span>
            <h2>Press play on your world</h2>
            <p>
              Your favorite albums, playlists, and discoveries—ready on every
              device.
            </p>
            <button
              className="primary-button"
              onClick={() => toggleTrack(tracks[0].id)}
            >
              {playing ? "Pause music" : "Play something good"}{" "}
              <Icon name={playing ? "pause" : "play"} size={17} />
            </button>
            <div className="vinyl-illustration">
              <div className="vinyl">
                <span />
              </div>
              <div className="album-sleeve">
                <Icon name="music" size={42} />
                <b>
                  Cloud
                  <br />
                  Sessions
                </b>
              </div>
            </div>
          </div>
          <div className="track-list">
            <div className="track-head">
              <span>Recently played</span>
              <button onClick={() => navigate("Music")}>
                See all <Icon name="arrow" size={17} />
              </button>
            </div>
            {tracks.slice(0, 8).map((track) => (
              <article
                className={playing === track.id ? "track active" : "track"}
                key={track.id}
              >
                <button
                  className="track-cover"
                  onClick={() => toggleTrack(track.id)}
                >
                  <img src={track.cover} alt="" />
                  <span>
                    <Icon
                      name={
                        playing === track.id && isPlaying ? "pause" : "play"
                      }
                      size={16}
                    />
                  </span>
                </button>
                <div className="track-title">
                  <b>{track.title}</b>
                  <small>{track.artist}</small>
                </div>
                <div className="equalizer" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span className="track-time">{track.length}</span>
                <a
                  href={track.src}
                  download={`${track.title}.mp3`}
                  aria-label={`Download ${track.title}`}
                >
                  <Icon name="download" size={18} />
                </a>
                <button
                  onClick={() => shareMedia("music", track.id, track.title)}
                  aria-label={`Share ${track.title}`}
                >
                  <Icon name="share" size={18} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="connect-section">
          <div className="connect-art">
            <div className="device laptop">
              <span>
                <img src="/media/balloons.jpg" alt="" />
              </span>
            </div>
            <div className="device phone">
              <span>
                <img src="/media/kyoto.jpg" alt="" />
              </span>
            </div>
            <div className="sync-cloud">
              <Icon name="cloud" size={54} />
              <i>
                <Icon name="check" size={14} />
              </i>
            </div>
          </div>
          <div className="connect-copy">
            <span className="eyebrow">Coming next</span>
            <h2>Connect Google Photos</h2>
            <p>
              Bring your existing library into Techzilla Cloud. New photos will
              appear here automatically, without changing how you use your
              devices.
            </p>
            <ul>
              <li>
                <Icon name="check" size={15} /> Automatic background sync
              </li>
              <li>
                <Icon name="check" size={15} /> Original quality preserved
              </li>
              <li>
                <Icon name="check" size={15} /> Your files stay private
              </li>
            </ul>
            <button
              className="primary-button"
              onClick={() =>
                alert("Google Photos connection will be available soon.")
              }
            >
              Notify me when ready <Icon name="arrow" />
            </button>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#">
          <span className="brand-cube">
            <i />
            <b />
            <em />
          </span>
          <span>
            Techzilla <strong>Cloud</strong>
          </span>
        </a>
        <p>Your life, in one beautiful place.</p>
        <div>
          <button>Privacy</button>
          <button>Help center</button>
          <button>Status</button>
        </div>
        <small>© 2025 Techzilla Cloud</small>
      </footer>

      {playing !== null && (
        <div className="grand-player visible">
          <button
            className="grand-close"
            onClick={() => {
              audioRef.current?.pause()
              if (audioRef.current) audioRef.current.currentTime = 0
              setCurrentTime(0)
              setPlaying(null)
            }}
            aria-label="Close music player"
          >
            <Icon name="x" size={15} />
          </button>
          <div className="grand-now">
            {current ? <img src={current.cover} alt="" /> : <span />}
            <div>
              <b>{current?.title ?? "Choose a song"}</b>
              <small>{current?.artist ?? "Techzilla Music"}</small>
            </div>
          </div>
          <div className="grand-controls">
            <button onClick={() => changeTrack(-1)} aria-label="Previous song">
              <Icon name="chevron" />
            </button>
            <button
              className="grand-play"
              onClick={() => current && toggleTrack(current.id)}
              aria-label={isPlaying ? "Pause song" : "Play song"}
            >
              <Icon name={isPlaying ? "pause" : "play"} />
            </button>
            <button onClick={() => changeTrack(1)} aria-label="Next song">
              <Icon name="chevron" />
            </button>
          </div>
          <div className="grand-progress">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              aria-label="Seek through song"
              style={{
                background: `linear-gradient(to right, #fff ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, rgba(255,255,255,.18) 0%)`,
              }}
              onChange={(event) => {
                const nextTime = Number(event.target.value)
                setCurrentTime(nextTime)
                if (audioRef.current) audioRef.current.currentTime = nextTime
              }}
            />
            <span>{formatTime(duration)}</span>
          </div>
          <a
            href={current?.src}
            download={current ? `${current.title}.mp3` : true}
            aria-label="Download current song"
          >
            <Icon name="download" />
          </a>
          {current && (
            <button
              className="grand-share"
              onClick={() => shareMedia("music", current.id, current.title)}
              aria-label="Share current song"
            >
              <Icon name="share" />
            </button>
          )}
        </div>
      )}

      {preview && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={preview.title}
          onMouseDown={() => setPreview(null)}
        >
          <div
            className="preview-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span>Previewing</span>
                <b>{preview.title}</b>
              </div>
              <div>
                <a href={preview.src} download aria-label="Download">
                  <Icon name="download" />
                </a>
                {preview.id && preview.kind && (
                  <button
                    onClick={() =>
                      shareMedia(preview.kind!, preview.id!, preview.title)
                    }
                    aria-label="Share"
                  >
                    <Icon name="share" />
                  </button>
                )}
                <button onClick={() => setPreview(null)} aria-label="Close">
                  <Icon name="x" />
                </button>
              </div>
            </div>
            {preview.type === "image" ? (
              <img src={preview.src} alt={preview.title} />
            ) : (
              <video
                key={`${preview.title}-${preview.index}`}
                src={preview.src}
                poster={preview.poster}
                controls
                autoPlay
                onEnded={() => movePreview(1)}
              />
            )}
            {preview.items && preview.items.length > 1 && (
              <>
                <button
                  className="preview-arrow previous"
                  onClick={() => movePreview(-1)}
                  aria-label="Previous item"
                >
                  <Icon name="chevron" size={27} />
                </button>
                <button
                  className="preview-arrow next"
                  onClick={() => movePreview(1)}
                  aria-label="Next item"
                >
                  <Icon name="chevron" size={27} />
                </button>
                <span className="preview-count">
                  {(preview.index ?? 0) + 1} / {preview.items.length}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      {shareNotice && (
        <div className="share-toast">
          <Icon name="check" size={16} /> {shareNotice}
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => changeTrack(1)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onDurationChange={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onError={(event) => console.error("Audio load error:", event)}
      />
    </div>
  )
}
