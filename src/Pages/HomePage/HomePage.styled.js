import styled from "styled-components";

/* ——— Общий фон страницы ——— */
export const HomeContainer = styled.div`
    background-color: ${({ theme }) => theme.background.primary};
    align-items: center;
    justify-content: center;
    max-width: 100%;
    min-height: 100vh;

  /* на мобилке отступаем вниз ровно на высоту fixed-navbar */
  @media (max-width: 991.98px) {
    padding-top: 56px;      /* стандартная высота bootstrap-navbar */
  }
`;

/* ——— Обёртка трёх колонок ——— */
export const Container = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    overflow-x: hidden;      /* горизонтальные вылазки прячем */
    overflow-y: visible;     /* высота теперь растёт вместе с контентом */

    /* ≤ 1024 px: колонки становятся вертикально */
    @media ${({ theme }) => theme.device.tablet} {
        flex-direction: column;
    }
`;

/* ——— Хедер (остаётся без изменений) ——— */
export const AppHeader = styled.header`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
`;

/* ——— Центральная колонка с задачами ——— */
export const CenterContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow-y: auto;
    padding-bottom: var(--quote-height, 120px);

    width: 60%;

    /* ≤ 1024 px: во всю ширину */
    @media ${({ theme }) => theme.device.tablet} {
        width: 100%;
    }
`;

/* ——— Сетка карточек задач ——— */
export const ContainerTasks = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    overflow: auto;
    margin: 10px 0;

    /* ≤ 768 px: карточки в столбик, выравниваем по центру */
    @media ${({ theme }) => theme.device.mobile} {
        flex-direction: column;
        align-items: center;
    }
`;

/* ——— Боковая секция (левый/правый сайдбар) ——— */
export const Section = styled.div`
    width: 20%;

    /* ≤ 1024 px: секция растягивается на всю ширину */
    @media ${({ theme }) => theme.device.tablet} {
        width: 100%;
    }
`;

/* ——— Заголовок «Current •••» ——— */
export const CurrentItem = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  text-transform: uppercase;
  margin: 20px 0;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.primary};

  /* ≤ 768 px: центрируем текст */
  @media ${({ theme }) => theme.device.mobile} {
    justify-content: center;
  }
`;

/* ——— Переключатель вида задач ——— */
export const ShapeView = styled.div`
  display: flex;
  left: 0;
  margin: 20px 0 40px 0;
  overflow: auto;

  /* ≤ 768 px: центрируем кнопки */
  @media ${({ theme }) => theme.device.mobile} {
    justify-content: center;
  }
`;

/* ——— Кнопка-иконка в ShapeView ——— */
export const ChildView = styled.span`
  padding: 3px;
  color: ${({ theme }) => theme.canvas};
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.background.viewBtnColor};
  }
`;
