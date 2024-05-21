import { useEffect } from 'react'
import banner from '@/assets/images/about.png'
import content from '@/assets/images/about-content.jpg'
const AboutHome = () => {
  useEffect(() => {
    scrollTo(0, 0)
    document.title = 'Fnest - Giới thiệu về chúng tôi'
  }, [])
  return (
    <section className="align-element">
      <div className="my-4 bg-white p-4">
        <img src={banner} alt="" className="w-full object-fit h-[380px]" />
        <div className="mx-40 my-10">
          <h2 className="text-3xl">Lịch sử hình thành</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, sequi perferendis porro atque vitae illum?
            Nisi nihil necessitatibus ad totam nobis veniam quas rerum odio saepe voluptatem repellat, ducimus
            molestias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum velit error minima quo
            voluptate fugiat iure accusantium veniam optio? Maxime, reprehenderit qui enim et accusamus architecto sunt
            dolores doloremque.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 my-10">
          <div>
            <img src={content} alt="" className="w-full object-cover " />
          </div>
          <div>
            <ul className="timeline timeline-vertical">
              <li>
                <div className="timeline-start">1984</div>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, voluptate nam voluptatum
                  assumenda exercitationem ipsa vitae! Delectus praesentium, veritatis aperiam sint, totam fugiat
                  impedit quo laborum ipsum mollitia quis et!
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">1998</div>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum officiis rerum necessitatibus
                  explicabo ab libero eveniet accusantium tempore? Quae et incidunt blanditiis eius ipsam cumque sunt
                  minus maxime ea repudiandae?
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">2001</div>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus similique culpa rerum incidunt
                  necessitatibus modi possimus debitis saepe fugiat, quidem dolores nihil distinctio amet consequuntur.
                  Labore corporis adipisci nobis voluptas!
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">2007</div>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. In recusandae harum consequatur minima
                  laboriosam voluptatibus temporibus itaque quos mollitia adipisci. Ad maiores amet, rerum modi esse
                  facilis. Ea, doloremque nesciunt.
                </div>
                <hr />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHome
