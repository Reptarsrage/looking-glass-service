const agents = [
  {
    percent: "15.4%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    system: "Chrome 107.0 Win10",
  },
  {
    percent: "12.9%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    system: "Chrome Generic Win10",
  },
  {
    percent: "11.6%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
    system: "Firefox 107.0 Win10",
  },
  {
    percent: "8.1%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    system: "Chrome 107.0 macOS",
  },
  {
    percent: "5.6%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    system: "Chrome Generic macOS",
  },
  {
    percent: "3.9%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0",
    system: "Firefox 107.0 Linux",
  },
  {
    percent: "3.1%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    system: "Safari 16.1 macOS",
  },
  {
    percent: "2.4%",
    useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0",
    system: "Firefox 107.0 macOS",
  },
  {
    percent: "2.2%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    system: "Chrome 107.0 Linux",
  },
  {
    percent: "1.6%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    system: "Chrome Generic Linux",
  },
  {
    percent: "1.5%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; rv:107.0) Gecko/20100101 Firefox/107.0",
    system: "Firefox 107.0 Win10",
  },
  {
    percent: "1.5%",
    useragent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0",
    system: "Firefox 107.0 Linux",
  },
  {
    percent: "1.2%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
    system: "Firefox Generic Win10",
  },
  {
    percent: "0.9%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
    system: "Firefox 106.0 Win10",
  },
  {
    percent: "0.9%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56",
    system: "Edge 107.0 Win10",
  },
  {
    percent: "0.8%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46",
    system: "Edge Generic Win10",
  },
  {
    percent: "0.8%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
    system: "Firefox 102.0 Linux",
  },
  {
    percent: "0.7%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.62",
    system: "Edge 107.0 Win10",
  },
  {
    percent: "0.7%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0",
    system: "Firefox 106.0 Linux",
  },
  {
    percent: "0.7%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    system: "Chrome 106.0 Win10",
  },
  {
    percent: "0.5%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42",
    system: "Edge 107.0 Win10",
  },
  {
    percent: "0.5%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
    system: "Firefox 102.0 Win10",
  },
  {
    percent: "0.5%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    system: "Chrome 107.0 Win10",
  },
  {
    percent: "0.5%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    system: "Chrome 106.0 Linux",
  },
  {
    percent: "0.5%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 OPR/92.0.0.0",
    system: "Chrome 106.0 Win10",
  },
  {
    percent: "0.5%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Safari/605.1.15",
    system: "Safari 15.6.1 macOS",
  },
  {
    percent: "0.4%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    system: "Chrome 106.0 macOS",
  },
  {
    percent: "0.4%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
    system: "Safari 16.0 macOS",
  },
  {
    percent: "0.4%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/93.0.0.0",
    system: "Chrome 107.0 Win10",
  },
  {
    percent: "0.4%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.52",
    system: "Edge 107.0 Win10",
  },
  {
    percent: "0.4%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
    system: "Chrome 99.0 Win10",
  },
  {
    percent: "0.4%",
    useragent:
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    system: "Chrome 107.0 Win7",
  },
  {
    percent: "0.4%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
    system: "Firefox Generic Linux",
  },
  {
    percent: "0.3%",
    useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0",
    system: "Firefox Generic macOS",
  },
  {
    percent: "0.3%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    system: "Chrome 103.0 Win10",
  },
  {
    percent: "0.3%",
    useragent:
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    system: "Chrome Generic Win7",
  },
  {
    percent: "0.3%",
    useragent: "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
    system: "Firefox 103.0 Linux",
  },
  {
    percent: "0.3%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    system: "Chrome 105.0 Win10",
  },
  {
    percent: "0.3%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
    system: "Firefox 91.0 Win10",
  },
  {
    percent: "0.3%",
    useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0",
    system: "Firefox 106.0 macOS",
  },
  {
    percent: "0.3%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    system: "Chrome 105.0 macOS",
  },
  {
    percent: "0.3%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.42",
    system: "Edge Generic Win10",
  },
  {
    percent: "0.2%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; rv:106.0) Gecko/20100101 Firefox/106.0",
    system: "Firefox 106.0 Win10",
  },
  {
    percent: "0.2%",
    useragent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0",
    system: "Firefox 106.0 Linux",
  },
  {
    percent: "0.2%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; rv:102.0) Gecko/20100101 Firefox/102.0",
    system: "Firefox 102.0 Win10",
  },
  {
    percent: "0.2%",
    useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
    system: "Firefox 105.0 Win10",
  },
  {
    percent: "0.2%",
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    system: "Chrome Generic Win10",
  },
  {
    percent: "0.2%",
    useragent:
      "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    system: "Chrome Generic Win8.1",
  },
  {
    percent: "0.2%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15",
    system: "Safari 16.2 macOS",
  },
  {
    percent: "0.2%",
    useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0",
    system: "Firefox 102.0 macOS",
  },
  {
    percent: "0.2%",
    useragent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
    system: "Firefox 107.0 Win7",
  },
  {
    percent: "0.2%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
    system: "Chrome 79.0 macOS",
  },
  {
    percent: "0.2%",
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
    system: "Chrome 79.0 macOS",
  },
];

export default agents;
