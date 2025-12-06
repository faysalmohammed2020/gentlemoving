// components/PrivacyPolicyPage.tsx or app/privacy-policy/page.tsx

import React from 'react';

/**
 * Privacy Policy Page Component for Gentle Moving Inc.
 * Displays the complete Privacy Policy content in English.
 */
const PrivacyPolicyPage: React.FC = () => {
  const lastUpdatedDate = "May 19, 2014"; // Updated date

  const sections = [
    {
      id: 1,
      title: "Personal Identification Information",
      content: (
        <>
          <p className="mb-4">
            We may collect <strong className="font-semibold text-gray-800">personal identification information</strong> from Users in a variety of ways, including, but not limited to, when Users visit our site, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, <strong className="font-semibold text-gray-800">name, email address, mailing address, phone number</strong>.
          </p>
          <p>
            Users may, however, visit our Site <strong className="font-semibold text-gray-800">anonymously</strong>. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.
          </p>
        </>
      )
    },
    {
      id: 2,
      title: "Non-Personal Identification Information",
      content: (
        <p>
          We may collect <strong className="font-semibold text-gray-800">non-personal identification information</strong> about Users whenever they interact with our Site. Non-personal identification information may include the <strong className="font-semibold text-gray-800">browser name</strong>, the <strong className="font-semibold text-gray-800">type of computer</strong> and <strong className="font-semibold text-gray-800">technical information</strong> about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
        </p>
      )
    },
    {
      id: 3,
      title: "Web Browser Cookies",
      content: (
        <p>
          Our Site may use <strong className="font-semibold text-gray-800">cookies</strong> to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to <strong className="font-semibold text-gray-800">refuse cookies</strong>, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
        </p>
      )
    },
    {
      id: 4,
      title: "How We Use Collected Information",
      content: (
        <>
          <p className="mb-4">Gentle Moving Inc may collect and use Users personal information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-3 mb-4">
            <li>
              <strong className="font-semibold text-gray-800">To process payments:</strong> We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">To send periodic emails:</strong> We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">To improve customer service:</strong> Information you provide helps us respond to your customer service requests and support needs more efficiently.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">To personalize user experience:</strong> We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">To improve our Site:</strong> We may use feedback you provide to improve our products and services.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      title: "How We Protect Your Information",
      content: (
        <>
          <p className="mb-4">
            We adopt appropriate data collection, storage and processing practices and <strong className="font-semibold text-gray-800">security measures</strong> to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
          </p>
          <p>
            Sensitive and private data exchange between the Site and its Users happens over a <strong className="font-semibold text-gray-800">SSL secured communication channel</strong> and is encrypted and protected with digital signatures. Our Site is also in compliance with PCI vulnerability standards in order to create as secure of an environment as possible for Users.
          </p>
        </>
      )
    },
    {
      id: 6,
      title: "Sharing Your Personal Information",
      content: (
        <>
          <p className="mb-4">
            We <strong className="font-semibold text-gray-800">do not sell, trade, or rent</strong> Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
          </p>
          <p>
            We may use third-party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.
          </p>
        </>
      )
    },
    {
      id: 7,
      title: "Third-Party Websites",
      content: (
        <p>
          Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.
        </p>
      )
    },
    {
      id: 8,
      title: "Changes to This Privacy Policy",
      content: (
        <>
          <p className="mb-4">
            Gentle Moving Inc has the discretion to update this privacy policy at any time. When we do, we will revise the <strong className="font-semibold text-gray-800">updated date</strong> at the bottom of this page and send you an email. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
          </p>
          <p>
            You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
          </p>
        </>
      )
    },
    {
      id: 9,
      title: "Your Acceptance of These Terms",
      content: (
        <p>
          By <strong className="font-semibold text-gray-800">using this Site</strong>, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 pb-8 border-b-2 border-gray-300">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            <span className="text-sm md:text-base text-gray-700">
              Last Updated: <span className="font-semibold">{lastUpdatedDate}</span>
            </span>
          </div>
        </header>

        {/* Introduction */}
        <div className="mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            This Privacy Policy governs the manner in which <strong className="font-semibold text-gray-900">Gentle Moving Inc</strong> collects, uses, maintains and discloses information collected from users (each, a "User") of the{" "}
            <a 
              href="https://gentlemoving.net" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              https://gentlemoving.net
            </a>{" "}
            website ("Site"). This privacy policy applies to the Site and all products and services offered by Gentle Moving Inc.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section 
              key={section.id} 
              className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 transition-all duration-200 hover:shadow-md"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                <span className="text-blue-600 font-bold mr-2">{section.id}.</span>
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}

          {/* Contact Section */}
          <section className="bg-gray-50 rounded-lg border-l-4 border-green-500 p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-300">
              <span className="text-green-600 font-bold mr-2">10.</span>
              Contacting Us
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-6">
                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
              </p>
              <address className="not-italic bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                <strong className="block text-lg font-semibold text-gray-900 mb-3">
                  Gentle Moving Inc
                </strong>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Website:</span>
                    <a 
                      href="https://gentlemoving.net" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      https://gentlemoving.net
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Address:</span>
                    <span>2719 Hollywood Blvd #1372 Hollywood, FL 33020</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Phone:</span>
                    <a 
                      href="tel:8882021370" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      (888) 202-1370
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Email:</span>
                    <a 
                      href="mailto:sales@gentlemoving.net" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      sales@gentlemoving.net
                    </a>
                  </p>
                </div>
              </address>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            This Privacy Policy is effective as of{" "}
            <strong className="font-semibold text-gray-800">{lastUpdatedDate}</strong>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;