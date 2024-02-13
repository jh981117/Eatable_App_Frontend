import React, { useEffect, useState } from "react";
import { Card, Container, Image, Spinner } from "react-bootstrap";
import { throttle } from "lodash";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [partners, setPartners] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    const loadPartners = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      setTimeout(async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/partner/homeList?page=${page}&size=4`
          );
          if (response.ok) {
            const data = await response.json();
            setPartners((prevPartners) => [
              ...prevPartners,
              ...data.content.filter(
                (partner) => !prevPartners.some((p) => p.id === partner.id)
              ),
            ]);
            setHasMore(data.content.length > 0);
          } else {
            throw new Error("Failed to fetch");
          }
        } catch (error) {
          console.error("Failed to fetch partners", error);
        } finally {
          setIsLoading(false);
        }
      }, 1000); // 1초 지연 후 데이터 로딩
    };

    loadPartners();
  }, [page]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.offsetHeight &&
        hasMore &&
        !isLoading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 100); // 100ms 마다 이벤트 핸들러 실행

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isLoading]);

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      {partners.map((partner) => (
        <Link
          to={`/store/${partner.id}`}
          key={partner.id}
          className="text-center mb-3"
          style={{ width: "100%", textDecoration: "none", color: "inherit" }}
        >
          <Image
            src={partner.fileList[0]?.imageUrl}
            alt="Partner"
            style={{
              width: "400px",
              height: "400px",
              borderRadius: "5%",
              objectFit: "cover",
            }}
          />
          <p className="mt-2">{partner.storeName}</p>
        </Link>
      ))}
      {isLoading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      )}
      {!isLoading && !hasMore && <p>No more partners</p>}
    </Container>
  );
};

export default HomePage;
