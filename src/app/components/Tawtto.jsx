// components/SmartsuppChat.js
"use client";
import React, { useEffect } from "react";
import Script from "next/script";

const SmartsuppChat = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window._smartsupp = window._smartsupp || {};
      window._smartsupp.key = "20c6630a5340fe4b33c61a9df3e12d8123d91058";
      window.smartsupp ||
        (function (d) {
          var s,
            c,
            o = (window.smartsupp = function () {
              o._.push(arguments);
            });
          o._ = [];
          s = d.getElementsByTagName("script")[0];
          c = d.createElement("script");
          c.type = "text/javascript";
          c.charset = "utf-8";
          c.async = true;
          c.src = "https://www.smartsuppchat.com/loader.js?";
          s.parentNode.insertBefore(c, s);
        })(document);
    }
  }, []);

  return (
    <>
      <Script src="https://www.smartsupp.com" />
      {/* <a
        href="https://www.smartsupp.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Smartsupp
      </a> */}
    </>
  );
};

export default SmartsuppChat;
