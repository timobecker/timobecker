import React from 'react';
import { Helmet } from 'react-helmet';
import PlainPage from '../PlainPage';
import style from './style.module.less';
import Img from 'gatsby-image';
import { getMailtoUrl } from '../util';

export default function ({
    data: {
        contentfulShopItem: { title, price, childContentfulShopItemDescriptionTextNode, og_image, images },
    },
    pageContext,
    path,
}) {
    console.log(images);
    const metaTags = [
        { name: 'description', content: childContentfulShopItemDescriptionTextNode?.childMarkdownRemark?.excerpt },
        {
            property: 'og:description',
            content: childContentfulShopItemDescriptionTextNode?.childMarkdownRemark?.excerpt,
        },
        { property: 'og:image', content: og_image && og_image[0] && og_image[0]?.fixed?.src },
    ];

    const buyLink = getMailtoUrl({
        to: 'order@timobecker.com',
        subject: `Bestellung: "${title}"`,
        body: `Hey Timo,

ich hätte gern "${title}".

Bitte schick mir die Rechnung.

Meine Adress ist:`,
    });

    return (
        <PlainPage
            className={style.container}
            title={
                <div className={style.title}>
                    {title}
                    <a href={buyLink} className={style.priceLabel}>
                        <div className={style.priceLabelBuy}>buy now!</div>
                        <div className={style.priceLabelPrice}>{price}€</div>
                    </a>
                </div>
            }
        >
            <div
                dangerouslySetInnerHTML={{
                    __html: childContentfulShopItemDescriptionTextNode?.childMarkdownRemark?.html,
                }}
            />
            <div className={style.images}>
                {images.map(({ id, fluid }) => (
                    <Img className={style.image} key={id} fluid={fluid} />
                ))}
            </div>
            <div className={style.buyButtonContainer}>
                <a href={buyLink} className={style.buyButton}>
                    BUY NOW!
                </a>
            </div>

            <Helmet meta={metaTags} />
        </PlainPage>
    );
}

export const pageQuery = graphql`
    query ShopItemsById($id: String!) {
        contentfulShopItem(id: { eq: $id }) {
            price
            title
            childContentfulShopItemDescriptionTextNode {
                childMarkdownRemark {
                    html
                    excerpt
                }
            }
            og_image: images {
                fixed(width: 1000) {
                    src
                }
            }
            images {
                id
                fluid(maxWidth: 1000) {
                    src
                    srcSet
                    sizes
                    aspectRatio
                }
            }
        }
    }
`;
