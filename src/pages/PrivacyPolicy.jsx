import React from 'react';
import Breadcrumb from '../components/Breadcrumb.jsx';
import siteConfig from '../config/siteConfig.js';
import './pages.css';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  const sections = [
    {
      num: '1',
      title: 'वेबसाइट का उद्देश्य',
      content: (
        <>
          <p>
            <strong>Haryana Information Hub</strong> एक स्वतंत्र डिजिटल सूचना मंच है, जिसका उद्देश्य उपयोगकर्ताओं को निम्नलिखित विषयों से संबंधित जानकारी उपलब्ध करवाना है:
          </p>
          <ul className="legal-list">
            <li>हरियाणा सरकार के नियम, आदेश एवं निर्देश।</li>
            <li>सरकारी योजनाएँ एवं महत्वपूर्ण सूचनाएँ।</li>
            <li>सरकारी भर्तियाँ एवं रोजगार संबंधी अपडेट।</li>
            <li>विभागीय परीक्षाओं की अध्ययन सामग्री।</li>
            <li>Treasury, e-Salary एवं HRMS संबंधी जानकारी।</li>
            <li>
              सरकारी कर्मचारियों के उपयोगी प्रोफॉर्मा एवं फाइलें, जिनमें Medical Reimbursement, LTC, GPF और NPS से संबंधित संसाधन शामिल हो सकते हैं।
            </li>
          </ul>
        </>
      ),
    },
    {
      num: '2',
      title: 'आधिकारिक सरकारी वेबसाइट नहीं',
      content: (
        <>
          <p>
            <strong>Haryana Information Hub एक स्वतंत्र वेबसाइट है।</strong> यह हरियाणा सरकार, भारत सरकार या किसी सरकारी विभाग की आधिकारिक वेबसाइट नहीं है।
          </p>
          <p>
            हम सरकारी सूचनाओं को उपयोगकर्ताओं तक पहुँचाने का प्रयास करते हैं, लेकिन किसी भी आदेश, भर्ती, योजना या विभागीय प्रक्रिया की अंतिम एवं प्रमाणिक जानकारी के लिए संबंधित सरकारी विभाग की आधिकारिक वेबसाइट या अधिसूचना देखें।
          </p>
        </>
      ),
    },
    {
      num: '3',
      title: 'जानकारी की सटीकता',
      content: (
        <>
          <p>
            हम वेबसाइट पर प्रकाशित जानकारी को सही, उपयोगी और अद्यतन रखने का प्रयास करते हैं। हालाँकि, सरकारी नियमों, भर्ती प्रक्रियाओं, आवेदन की अंतिम तिथियों, पात्रता शर्तों और विभागीय निर्देशों में बदलाव हो सकता है।
          </p>
          <p>
            इसलिए हम वेबसाइट पर उपलब्ध प्रत्येक जानकारी की पूर्ण सटीकता, निरंतर उपलब्धता या हर समय अद्यतन होने की गारंटी नहीं देते।
          </p>
          <p className="legal-highlight">
            किसी भी महत्वपूर्ण निर्णय से पहले संबंधित विभाग से जानकारी की पुष्टि करना उपयोगकर्ता की जिम्मेदारी है।
          </p>
        </>
      ),
    },
    {
      num: '4',
      title: 'सरकारी भर्ती एवं रोजगार संबंधी जानकारी',
      content: (
        <>
          <p>
            वेबसाइट पर प्रकाशित भर्ती संबंधी जानकारी केवल सामान्य सूचना और मार्गदर्शन के उद्देश्य से उपलब्ध करवाई जाती है।
          </p>
          <p>
            उपयोगकर्ताओं को सलाह दी जाती है कि आवेदन करने से पहले संबंधित भर्ती की आधिकारिक अधिसूचना ध्यानपूर्वक पढ़ें और पात्रता, आयु सीमा, आवेदन शुल्क, अंतिम तिथि तथा अन्य शर्तों की पुष्टि करें।
          </p>
          <p>
            भर्ती प्रक्रिया, चयन, परीक्षा परिणाम या नियुक्ति से संबंधित निर्णयों के लिए संबंधित भर्ती प्राधिकरण के आधिकारिक निर्देश मान्य होंगे।
          </p>
          <p className="legal-warning">
            ⚠️ Haryana Information Hub किसी नौकरी, चयन या नियुक्ति की गारंटी नहीं देता।
          </p>
        </>
      ),
    },
    {
      num: '5',
      title: 'डाउनलोड करने योग्य फाइलें एवं प्रोफॉर्मा',
      content: (
        <>
          <p>
            वेबसाइट पर उपलब्ध प्रोफॉर्मा, आवेदन प्रारूप, अध्ययन सामग्री और अन्य फाइलें उपयोगकर्ताओं की सुविधा के लिए उपलब्ध करवाई जा सकती हैं।
          </p>
          <p>
            इनका उपयोग करने से पहले संबंधित विभाग के वर्तमान नियमों और निर्धारित प्रारूप से इनका मिलान करना आवश्यक है।
          </p>
          <p>
            यदि किसी विभाग द्वारा नया प्रारूप या संशोधित निर्देश जारी किया गया है, तो संबंधित विभाग का नवीनतम आधिकारिक प्रारूप मान्य होगा।
          </p>
        </>
      ),
    },
    {
      num: '6',
      title: 'उपयोगकर्ताओं का आचरण',
      content: (
        <>
          <p>वेबसाइट का उपयोग करते समय आप सहमत होते हैं कि:</p>
          <ul className="legal-list">
            <li>वेबसाइट का उपयोग किसी गैरकानूनी उद्देश्य के लिए नहीं करेंगे।</li>
            <li>वेबसाइट की सुरक्षा या कार्यप्रणाली को नुकसान पहुँचाने का प्रयास नहीं करेंगे।</li>
            <li>किसी अन्य व्यक्ति की पहचान का दुरुपयोग नहीं करेंगे।</li>
            <li>स्पैम, भ्रामक सामग्री या हानिकारक लिंक प्रसारित नहीं करेंगे।</li>
            <li>वेबसाइट की सामग्री का उपयोग लागू कानूनों का उल्लंघन करने के लिए नहीं करेंगे।</li>
          </ul>
          <p>
            इन शर्तों का उल्लंघन होने पर वेबसाइट तक पहुँच प्रतिबंधित की जा सकती है, जहाँ ऐसा करना उचित और कानूनी हो।
          </p>
        </>
      ),
    },
    {
      num: '7',
      title: 'बौद्धिक संपदा एवं कॉपीराइट',
      content: (
        <>
          <p>
            वेबसाइट का मूल लेखन, डिजाइन, लोगो, ग्राफिक्स और अन्य मौलिक सामग्री, जहाँ लागू हो, संबंधित अधिकारधारकों के बौद्धिक संपदा अधिकारों के अधीन हैं।
          </p>
          <p>
            सरकारी आदेशों, अधिसूचनाओं और सार्वजनिक दस्तावेजों का उपयोग संबंधित कानूनों एवं लागू अधिकारों के अधीन होगा। किसी अन्य व्यक्ति या संस्था की सामग्री का पुनः उपयोग करते समय उसके लागू कॉपीराइट और लाइसेंस नियमों का पालन करना आवश्यक है।
          </p>
          <p>
            बिना अनुमति वेबसाइट की मौलिक सामग्री, लोगो या डिजाइन की व्यावसायिक नकल या पुनर्प्रकाशन न करें, जहाँ इसके लिए अनुमति आवश्यक हो।
          </p>
        </>
      ),
    },
    {
      num: '8',
      title: 'बाहरी वेबसाइटों के लिंक',
      content: (
        <>
          <p>
            वेबसाइट पर सरकारी विभागों, भर्ती बोर्डों और अन्य Third-Party Websites के लिंक दिए जा सकते हैं।
          </p>
          <p>
            ये लिंक उपयोगकर्ताओं की सुविधा के लिए उपलब्ध करवाए जाते हैं। बाहरी वेबसाइटों की सामग्री, उपलब्धता, सुरक्षा या नीतियों के लिए Haryana Information Hub जिम्मेदार नहीं है।
          </p>
          <p>
            बाहरी वेबसाइट का उपयोग संबंधित वेबसाइट की शर्तों के अधीन होगा।
          </p>
        </>
      ),
    },
    {
      num: '9',
      title: 'विज्ञापन एवं Third-Party Services',
      content: (
        <>
          <p>
            भविष्य में वेबसाइट पर विज्ञापन, Analytics Tools या अन्य Third-Party Services उपलब्ध करवाई जा सकती हैं।
          </p>
          <p>
            इन सेवाओं का उपयोग होने पर संबंधित सेवा प्रदाताओं की शर्तें और गोपनीयता नीतियाँ भी लागू हो सकती हैं। जहाँ आवश्यक हो, संबंधित जानकारी उपयोगकर्ताओं को उपलब्ध करवाई जाएगी।
          </p>
        </>
      ),
    },
    {
      num: '10',
      title: 'दायित्व की सीमा',
      content: (
        <>
          <p>
            लागू कानूनों द्वारा अनुमत सीमा तक, Haryana Information Hub वेबसाइट पर उपलब्ध जानकारी के उपयोग, उसमें हुई त्रुटियों, अस्थायी अनुपलब्धता या बाहरी वेबसाइटों पर निर्भरता से उत्पन्न नुकसान के लिए अपनी जिम्मेदारी को सीमित करता है।
          </p>
          <p>
            यह प्रावधान उन अधिकारों या दायित्वों को समाप्त नहीं करता जिन्हें लागू कानून के अंतर्गत सीमित या बाहर नहीं किया जा सकता।
          </p>
        </>
      ),
    },
    {
      num: '11',
      title: 'वेबसाइट में बदलाव',
      content: (
        <>
          <p>
            हम वेबसाइट की सामग्री, सुविधाओं, सेवाओं या इन नियमों में समय-समय पर बदलाव कर सकते हैं।
          </p>
          <p>
            संशोधित Terms &amp; Conditions / Privacy Policy इसी पेज पर प्रकाशित की जाएँगी। बदलाव प्रकाशित होने के बाद वेबसाइट का उपयोग जारी रखना संशोधित शर्तों के अधीन होगा, जहाँ लागू कानून के अनुसार ऐसा प्रभावी हो।
          </p>
        </>
      ),
    },
    {
      num: '12',
      title: 'लागू कानून',
      content: (
        <>
          <p>
            इन Terms &amp; Conditions पर भारत के लागू कानून लागू होंगे। किसी विवाद की स्थिति में सक्षम न्यायालय का क्षेत्राधिकार लागू कानूनों के अनुसार निर्धारित होगा।
          </p>
        </>
      ),
    },
    {
      num: '13',
      title: 'हमसे संपर्क करें',
      content: (
        <>
          <p>
            इन Terms &amp; Conditions या Privacy Policy से संबंधित किसी प्रश्न या सुझाव के लिए हमसे संपर्क करें:
          </p>
          <div className="legal-contact-card">
            <div className="legal-contact-row">
              <strong>Website:</strong> <span>Haryana Information Hub</span>
            </div>
            <div className="legal-contact-row">
              <strong>Email:</strong>{' '}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>
            {siteConfig.phone && (
              <div className="legal-contact-row">
                <strong>Helpline:</strong>{' '}
                <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </div>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="privacy-page">
      {/* Hero Section */}
      <div className="detail-hero privacy-hero">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'मुख्य पृष्ठ', to: '/' },
              { label: 'Privacy Policy & Terms' },
            ]}
          />
          <div className="privacy-hero__badge-wrap">
            <span className="eyebrow detail-hero__eyebrow">नियम एवं नीतियां</span>
            <span className="privacy-hero__tag">Terms &amp; Conditions</span>
          </div>
          <h1 className="detail-hero__title privacy-hero__title">
            Privacy Policy &amp; Terms – Haryana Information Hub
          </h1>
          <div className="privacy-meta-bar">
            <span className="privacy-updated-badge">
              📅 Last Updated: 23 October 2026
            </span>
          </div>
        </div>
      </div>

      <div className="container page-body privacy-body">
        {/* Intro Alert Box */}
        <div className="privacy-intro-card">
          <div className="privacy-intro-icon">🛡️</div>
          <div>
            <h2 className="privacy-intro-title">Haryana Information Hub की वेबसाइट पर आपका स्वागत है</h2>
            <p className="privacy-intro-text">
              वेबसाइट का उपयोग करके आप इन <strong>Terms &amp; Conditions (नियम एवं शर्तों)</strong> तथा Privacy Policy से सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="privacy-sections-stack">
          {sections.map((section) => (
            <div key={section.num} className="privacy-section-card" id={`section-${section.num}`}>
              <div className="privacy-section-header">
                <span className="privacy-section-num">{section.num}</span>
                <h2 className="privacy-section-title">{section.title}</h2>
              </div>
              <div className="privacy-section-content">{section.content}</div>
            </div>
          ))}
        </div>

        {/* Bottom Closing Brand Box */}
        <div className="privacy-brand-footer">
          <h3 className="privacy-brand-footer__title">Haryana Information Hub</h3>
          <p className="privacy-brand-footer__desc">
            हरियाणा से संबंधित सरकारी जानकारी, रोजगार अपडेट और कर्मचारी उपयोगी संसाधनों के लिए एक स्वतंत्र डिजिटल सूचना मंच।
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
