/**
 * ContactTop.jsx  (updated — fetches contact info from API)
 * Drop-in replacement for your existing ContactTop component.
 *
 * Requires: src/utils/contactInfoApi.js  (provided separately)
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getContactInfo } from '@/utils/contactinfoApi';

/* ─── icon map (matches your existing tji- icon font) ───────────────────── */
const TYPE_ICON = {
  location: 'tji-location-3',
  email:    'tji-envelop',
  phone:    'tji-phone',
  livechat: 'tji-chat',
};

/* ─── static fallback (shown while loading or on fetch error) ────────────── */
const FALLBACK = [
  {
    type: 'location', title: 'Our Location',
    lines: [{ value: 'INSPIRE EDUCATION SERVICE, floor aazra arcade, near central excise office, mettupalayam, Palakkad - 678001' }],
  },
  {
    type: 'email', title: 'Email us',
    lines: [{ value: 'inspireeduservice001@gmail.com', href: 'mailto:inspireeduservice001@gmail.com' }],
  },
  {
    type: 'phone', title: 'Call us',
    lines: [
      { value: '0091 7593 091 945', href: 'tel:00917593091945' },
      { value: '+91 9947 945 945',  href: 'tel:+919947945945' },
    ],
  },
  {
    type: 'livechat', title: 'Live chat',
    lines: [
      { value: 'inspireeduservice001@gmail.com', href: 'mailto:inspireeduservice001@gmail.com' },
      { label: 'active', value: 'Need help?', href: '/contact' },
    ],
  },
];

export default function ContactTop() {
  const [cards, setCards] = useState(FALLBACK);

  useEffect(() => {
    getContactInfo()
      .then(r => { if (r.data?.success && r.data.data.length > 0) setCards(r.data.data); })
      .catch(() => { /* use fallback silently */ });
  }, []);

  return (
    <div className="tj-contact-area section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-heading text-center">
              <span className="sub-title wow fadeInUp" data-wow-delay=".1s">
                <i className="tji-box"></i>Contact info
              </span>
              <h2 className="sec-title title-anim">
                <span>Reach</span> Out to Us
              </h2>
            </div>
          </div>
        </div>

        <div className="row row-gap-4">
          {cards.map((card, idx) => (
            <div
              key={card.type}
              className="col-xl-3 col-lg-6 col-sm-6 d-flex"
            >
              <div
                className="contact-item style-2 wow fadeInUp w-100"
                data-wow-delay={`${0.3 + idx * 0.2}s`}
                style={cardStyle}
              >
                <div className="contact-icon" style={iconWrapStyle}>
                  <i className={TYPE_ICON[card.type] || 'tji-location-3'}></i>
                </div>
                <h3 className="contact-title" style={titleStyle}>{card.title}</h3>

                {/* Location: plain text */}
                {card.type === 'location' ? (
                  <p style={textStyle}>{card.lines[0]?.value}</p>
                ) : (
                  <ul className="contact-list" style={listStyle}>
                    {card.lines.map((line, i) => (
                      <li
                        key={i}
                        className={line.label === 'active' ? 'active' : ''}
                        style={listItemStyle}
                      >
                        {line.href ? (
                          <Link href={line.href} style={linkStyle}>
                            {line.value}
                          </Link>
                        ) : (
                          <span style={linkStyle}>{line.value}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── styles (unchanged from original) ─────────────────────────────────── */
const cardStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  textAlign: 'center', padding: '32px 20px', boxSizing: 'border-box', height: '100%',
};
const iconWrapStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, marginBottom: 16,
};
const titleStyle   = { marginBottom: 12, flexShrink: 0 };
const textStyle    = { margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' };
const listStyle    = { listStyle: 'none', padding: 0, margin: 0, width: '100%' };
const listItemStyle = { wordBreak: 'break-word', overflowWrap: 'break-word', marginBottom: 6 };
const linkStyle    = { wordBreak: 'break-word', overflowWrap: 'break-word', display: 'inline-block', maxWidth: '100%' };