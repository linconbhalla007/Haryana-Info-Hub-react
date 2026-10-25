import React from 'react';
import Breadcrumb from '../components/Breadcrumb.jsx';
import './pages.css';
import './About.css';

function About() {
  const offerings = [
    {
      num: '1',
      title: 'सरकारी आदेश एवं निर्देश',
      subtitle: 'Government Orders & Instructions',
      desc: 'हरियाणा सरकार तथा विभिन्न सरकारी विभागों द्वारा जारी महत्वपूर्ण आदेश, अधिसूचनाएँ, कार्यालय निर्देश, नीतियाँ, नियम और अन्य उपयोगी सरकारी सूचनाएँ।',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      accent: 'orange',
    },
    {
      num: '2',
      title: 'सरकारी भर्तियाँ एवं रोजगार जानकारी',
      subtitle: 'Government Jobs & Employment Updates',
      desc: 'हरियाणा में निकलने वाली सरकारी भर्तियों, भर्ती अधिसूचनाओं, पात्रता, आवेदन प्रक्रिया, परीक्षा तिथियों, प्रवेश पत्र, परीक्षा परिणाम और अन्य रोजगार संबंधी जानकारियों से जुड़े अपडेट।',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      accent: 'blue',
    },
    {
      num: '3',
      title: 'सरकारी कर्मचारियों के उपयोगी प्रोफॉर्मा एवं फाइलें',
      subtitle: 'Useful Forms & Documents for Government Employees',
      desc: 'सरकारी कर्मचारियों के दैनिक कार्यालयीन कार्यों को आसान बनाने के उद्देश्य से Medical Reimbursement, LTC, GPF, NPS तथा अन्य आवश्यक विभागीय कार्यों से संबंधित उपयोगी प्रोफॉर्मा, आवेदन प्रारूप और फाइलें उपलब्ध करवाने का प्रयास।',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      accent: 'green',
    },
    {
      num: '4',
      title: 'Treasury, e-Salary एवं HRMS संबंधी जानकारी',
      subtitle: 'Treasury, e-Salary & HRMS Guidelines',
      desc: 'कोषागार से संबंधित कार्यों, e-Salary, HRMS, वेतन बिल, पेंशन, बजट, सरकारी भुगतान और अन्य विभागीय प्रक्रियाओं से जुड़ी उपयोगी जानकारी एवं मार्गदर्शन।',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      accent: 'purple',
    },
    {
      num: '5',
      title: 'विभागीय परीक्षाएँ एवं अध्ययन सामग्री',
      subtitle: 'Departmental Exams & Study Materials',
      desc: 'हरियाणा सरकार के कर्मचारियों की विभागीय परीक्षाओं की तैयारी के लिए अध्ययन सामग्री, महत्वपूर्ण प्रश्न-उत्तर, परीक्षा उपयोगी नोट्स, पुराने प्रश्नपत्र तथा अन्य सहायक शैक्षणिक संसाधन।',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      accent: 'orange',
    },
    {
      num: '6',
      title: 'सरकारी योजनाएँ एवं महत्वपूर्ण सूचनाएँ',
      subtitle: 'Government Schemes & Important Updates',
      desc: 'हरियाणा सरकार एवं केंद्र सरकार की विभिन्न जनकल्याणकारी योजनाओं, उनकी पात्रता, आवेदन प्रक्रिया और आम नागरिकों के लिए उपयोगी महत्वपूर्ण सूचनाओं से संबंधित जानकारी।',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      accent: 'green',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="detail-hero about-hero">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'मुख्य पृष्ठ', to: '/' },
              { label: 'हमारे बारे में (About Us)' },
            ]}
          />
          <div className="about-hero__badge-wrap">
            <span className="eyebrow detail-hero__eyebrow">परिचय एवं उद्देश्य</span>
            <span className="about-hero__tag">Official Information Platform</span>
          </div>
          <h1 className="detail-hero__title about-hero__title">
            About Us – Haryana Information Hub
          </h1>
          <p className="about-hero__tagline">
            हरियाणा सरकार के नियम एवं निर्देश, सरकारी नौकरियों, सरकारी योजनाओं और सरकारी कर्मचारियों से संबंधित जानकारी का विश्वसनीय मंच।
          </p>
        </div>
      </div>

      <div className="container page-body about-body">
        {/* Welcome Section */}
        <div className="about-card about-welcome-card">
          <div className="about-welcome-badge">
            <span>स्वागतम</span>
          </div>
          <h2 className="about-card__title">Haryana Information Hub में आपका हार्दिक स्वागत है</h2>
          <p className="about-lead">
            <strong>Haryana Information Hub</strong> एक डिजिटल सूचना मंच है, जिसका उद्देश्य हरियाणा प्रदेश के नागरिकों, सरकारी कर्मचारियों, युवाओं एवं प्रतियोगी परीक्षाओं की तैयारी करने वाले अभ्यर्थियों तक महत्वपूर्ण सरकारी सूचनाएँ, नियम एवं निर्देश, सरकारी योजनाओं, रोजगार तथा कर्मचारी उपयोगी संसाधनों से संबंधित जानकारी <strong>एक ही स्थान पर उपलब्ध करवाना</strong> है।
          </p>

          <div className="about-inspiration-box">
            <div className="about-inspiration-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div className="about-inspiration-text">
              <h3 className="about-inspiration-heading">सुशासन एवं सेवा संकल्प</h3>
              <p>
                हमारा उद्देश्य माननीय प्रधानमंत्री श्री नरेंद्र मोदी जी के <strong>सेवा संकल्प अभियान एवं सुशासन के संकल्प</strong> से प्रेरित होकर डिजिटल माध्यम से सूचनाओं को आमजन तक सरल, सहज और सुविधाजनक तरीके से पहुँचाने में योगदान देना है।
              </p>
            </div>
          </div>

          <p className="about-p">
            हमारा प्रयास है कि सरकारी सूचनाओं के लिए लोगों को अलग-अलग वेबसाइटों पर भटकना न पड़े और उन्हें अपनी आवश्यकता के अनुसार महत्वपूर्ण जानकारी एक ही प्लेटफॉर्म पर आसानी से मिल सके।
          </p>
        </div>

        {/* Offerings Section */}
        <div className="about-section-head">
          <span className="eyebrow">सेवाएं एवं संसाधन</span>
          <h2 className="section-title">हमारी वेबसाइट पर क्या उपलब्ध है?</h2>
          <p className="about-subtitle">
            नागरिकों, युवाओं और कर्मचारियों की आवश्यकताओं को ध्यान में रखते हुए तैयार किए गए मुख्य अनुभाग:
          </p>
        </div>

        <div className="about-grid">
          {offerings.map((item) => (
            <div key={item.num} className={`about-feature-card about-feature-card--${item.accent}`}>
              <div className="about-feature-card__top">
                <div className="about-feature-card__icon">{item.icon}</div>
                <span className="about-feature-card__num">0{item.num}</span>
              </div>
              <h3 className="about-feature-card__title">{item.title}</h3>
              <div className="about-feature-card__subtitle">{item.subtitle}</div>
              <p className="about-feature-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision Row */}
        <div className="about-mv-row">
          {/* Mission */}
          <div className="about-mv-card about-mv-card--mission">
            <div className="about-mv-card__header">
              <div className="about-mv-card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <span className="eyebrow">Our Mission</span>
                <h2 className="about-mv-card__title">हमारा उद्देश्य</h2>
              </div>
            </div>
            <p>
              हमारा मिशन हरियाणा के नागरिकों, सरकारी कर्मचारियों और युवाओं को महत्वपूर्ण सरकारी जानकारी तक <strong>आसान पहुँच</strong> प्रदान करना है।
            </p>
            <p>
              हम चाहते हैं कि <strong>सरकारी कर्मचारियों को अपने कार्यालयीन कार्यों में सहायता मिले</strong>, युवाओं को रोजगार के अवसरों की जानकारी समय पर प्राप्त हो और आम नागरिकों को सरकारी योजनाओं, नियमों एवं निर्देशों की जानकारी सरल भाषा में मिल सके।
            </p>
          </div>

          {/* Vision */}
          <div className="about-mv-card about-mv-card--vision">
            <div className="about-mv-card__header">
              <div className="about-mv-card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                </svg>
              </div>
              <div>
                <span className="eyebrow">Our Vision</span>
                <h2 className="about-mv-card__title">हमारा विजन</h2>
              </div>
            </div>
            <p>
              Haryana Information Hub को हरियाणा से संबंधित सरकारी नियमों, निर्देशों, रोजगार, सरकारी योजनाओं, कर्मचारी हितों और उपयोगी विभागीय संसाधनों के लिए <strong>एक व्यवस्थित एवं सुविधाजनक डिजिटल सूचना मंच</strong> के रूप में विकसित करना हमारा लक्ष्य है।
            </p>
            <p>
              हमारा उद्देश्य ऐसा प्लेटफॉर्म तैयार करना है, जहाँ सरकारी कर्मचारी, युवा और आम नागरिक अपनी आवश्यकता के अनुसार महत्वपूर्ण जानकारी आसानी से प्राप्त कर सकें।
            </p>
          </div>
        </div>

        {/* Commitment Box */}
        <div className="about-card about-commitment-card">
          <div className="about-commitment-header">
            <div className="about-commitment-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
            <div>
              <span className="eyebrow">Our Commitment</span>
              <h2 className="about-card__title">हमारी प्रतिबद्धता</h2>
            </div>
          </div>
          <p>
            हम उपलब्ध जानकारी को <strong>सरल, स्पष्ट और उपयोगी</strong> रूप में प्रस्तुत करने का प्रयास करते हैं। हमारा उद्देश्य सूचनाओं को अधिक से अधिक लोगों तक पहुँचाना और डिजिटल माध्यम से जानकारी प्राप्त करने की प्रक्रिया को सुविधाजनक बनाना है।
          </p>
          <div className="about-note-banner">
            <span className="about-note-icon">ℹ️</span>
            <p>
              हम प्रयास करते हैं कि उपयोगकर्ताओं को संबंधित विषयों की जानकारी व्यवस्थित रूप से मिले। किसी भी सरकारी आदेश, भर्ती, नियम, योजना या विभागीय प्रक्रिया से संबंधित महत्वपूर्ण निर्णय लेने से पहले <strong>संबंधित विभाग की आधिकारिक अधिसूचना एवं वेबसाइट से जानकारी की पुष्टि अवश्य करें</strong>।
            </p>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="about-disclaimer-box">
          <div className="about-disclaimer-header">
            <div className="about-disclaimer-icon">⚠️</div>
            <div>
              <span className="about-disclaimer-tag">Disclaimer</span>
              <h2 className="about-disclaimer-title">महत्वपूर्ण सूचना</h2>
            </div>
          </div>
          <p>
            <strong>Haryana Information Hub एक स्वतंत्र डिजिटल सूचना मंच है।</strong> यह हरियाणा सरकार, भारत सरकार या किसी सरकारी विभाग की आधिकारिक वेबसाइट नहीं है और न ही किसी सरकारी विभाग का आधिकारिक प्रतिनिधित्व करने का दावा करता है।
          </p>
          <p>
            वेबसाइट पर प्रकाशित सूचनाएँ सामान्य जानकारी, जागरूकता एवं शैक्षणिक उद्देश्यों के लिए उपलब्ध करवाई जाती हैं। सरकारी आदेशों, भर्ती नियमों, योजनाओं और विभागीय प्रक्रियाओं के संबंध में <strong>संबंधित विभाग द्वारा जारी आधिकारिक अधिसूचना एवं निर्देश ही मान्य होंगे</strong>।
          </p>
        </div>

        {/* Stay Connected Banner */}
        <div className="about-connect-banner">
          <div className="about-connect-content">
            <span className="about-connect-tag">Stay Connected</span>
            <h2 className="about-connect-title">हमसे जुड़े रहें</h2>
            <p className="about-connect-desc">
              Haryana Information Hub से जुड़कर हरियाणा सरकार के नियमों एवं निर्देशों, सरकारी भर्तियों, सरकारी कर्मचारियों से संबंधित जानकारी, विभागीय प्रक्रियाओं और सरकारी योजनाओं के महत्वपूर्ण अपडेट प्राप्त करें।
            </p>
            <div className="about-connect-pledge">
              <span className="about-connect-pledge-lead">हमारा संकल्प:</span>
              <span>जानकारी को सरल बनाना, डिजिटल पहुँच बढ़ाना और जनसेवा में योगदान देना।</span>
            </div>
          </div>
        </div>

        {/* Technology Partner - Simple subtle note at the very bottom */}
        <div className="about-tech-partner">
          <p className="about-tech-partner__lead">
            We build modern web applications and AI-powered digital solutions to make information more accessible and easier to use.
          </p>
          <div className="about-tech-partner__meta">
            <span>
              Technology Partner:{" "}
              <a
                href="https://www.godude.in"
                target="_blank"
                rel="noopener noreferrer"
                className="about-tech-partner__link"
              >
                GoDude Software
              </a>
            </span>
            <span className="about-tech-partner__sep">•</span>
            <span>
              Website:{" "}
              <a
                href="https://www.godude.in"
                target="_blank"
                rel="noopener noreferrer"
                className="about-tech-partner__link"
              >
                https://www.godude.in
              </a>
            </span>
            <span className="about-tech-partner__sep">•</span>
            <span>
              Email:{" "}
              <a
                href="mailto:info@godude.in"
                className="about-tech-partner__link"
              >
                info@godude.in
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
