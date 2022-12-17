import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Faq = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'testimonial section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const sectionHeader = {
    title: 'Frequently Asked Questions',
    paragraph: 'Hopefully we have an answer for you already'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <p>
          <em>* What is La Scaloneta? </em>
          </p>
          <p>
            - La Scaloneta refers to the Argentina football national team that played the 2022 WorldCup in Qatar. Its name comes from the coach, Scaloni, and it was a sort of meme and an analogy to an old but good car that is still good enough. You can find a few memes on the internet if you browse.
          </p>
          <p>
          <em>* What is a wallet? </em>
          </p>
          <p>
            - A wallet is like a bank account in the blockchain world. You need it to operate with blockchain applications or websites.
          </p>
          <p>
          <em>* OK, but I don't have one. Good luck!</em>
          </p>
          <p>
            - Wait, you can create one for free. Popular choices are Metamask, Coinbase or TrustMask. 
              Just try to connect and you will be routed to a download page. 
          </p>
          <p>
          <em>* The membership card is supposed to be free, why do I have to pay for it?</em>
          </p>
          <p>
            - In the real world, someone is paying for everything you do. When you transfer money with your bank, and they don't charge you for it, the bank is absorbing the cost. 
              We don't have banks on blockchain, so it's the customer (you) who must pay for transfers. So the membership card is free, but the transaction is not. 
          </p>
          <p>
          <em>* How much does it cost?</em>
          </p>
          <p>
            - Fairly cheap. We are talking about less than 0.5 USD
          </p>
          <p>
          <em>* What's going on in the community right now, why would I join?</em>
          </p>
          <p>
            - It's still the early days, and the community may develop in an organic way. However, a few ideas could be to raise funds to get a new fancy logo, buy or sell digital collectibles, or buy a digital gift to our dear players. All proposals will have to be approved by the members!
          </p>
          <p>
          <em>* Hablo Español y no entiendo inglés</em>
          </p>
          <p>
            - Perdón, pero no tuve tiempo de hacerlo en varios idiomas. Ayudate con el traductor que viene incluido en Google Chrome! (Click derecho y traducir a Español)
          </p>
        </div>
        
      </div>
    </section>
  );
}

Faq.propTypes = propTypes;
Faq.defaultProps = defaultProps;

export default Faq;