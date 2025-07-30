import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import { productService } from "@/services/product";
import { ensureImageUrl } from "@/utils/imageHelper";
import "./index.scss";

import type { Product } from '@/services/types';

interface WaterfallFlowProps {
  tabId: number;
}

const WaterfallFlow: React.FC<WaterfallFlowProps> = ({ tabId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [queryParams, setQueryParams] = useState({
    pageNum: 1,
    pageSize: 10,
    categoryId: tabId, // 使用从父组件传入的分类ID
  })
  const [total, setTotal] = useState<number | undefined>(undefined);

  // 获取图片高度比例，用于占位
  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    const width = (systemInfo.windowWidth || 375) / 2 - 10; // 两列布局，减去间距
    setPlaceholderHeight(width * 1.3); // 假设图片比例为1:1.3
  }, []);

  // 模拟数据获取
  const fetchData = async (currentPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      console.log('queryParams', queryParams)
      const response = await productService.getProducts({
        ...queryParams,
        pageNum: currentPage
      });
      console.log('response', response)
      setData((prev) => [...prev, ...response.rows]);
      setPage(currentPage + 1);
      setHasMore(response.total ? currentPage * queryParams.pageSize < response.total : false);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和tab切换时重新加载
  useEffect(() => {
    console.log("🔄 tabId变化，准备重新加载数据", {
      oldTabId: queryParams.categoryId,
      newTabId: tabId,
      loading,
      hasMore
    });

    // 强制重置状态
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(false); // 确保可以发起新请求

    // 立即更新queryParams
    const newQueryParams = {
      pageNum: 1,
      pageSize: 10,
      categoryId: tabId
    };
    console.log("更新queryParams:", newQueryParams);
    setQueryParams(newQueryParams);

    // 确保一定会发起请求
    setTimeout(() => {
      console.log("开始请求数据...");
      fetchData(1);
    }, 0);
  }, [tabId]);

  // 上拉加载更多
  const handleScrollToLower = () => {
    fetchData(page);
  };

  // 监听页面滚动到底部
  useEffect(() => {
    // console.log("🔄 初始化滚动监听，当前环境:", process.env.TARO_ENV);
    const handleReachBottom = () => {
      // console.log("✅ 触发滚动到底部事件");
      if (!loading && hasMore) {
        // console.log("⏳ 开始加载第", page, "页数据...");
        handleScrollToLower();
      }
    };

    // 抖音小程序特殊处理
    if (process.env.TARO_ENV === "tt") {
      // console.log("?? 初始化抖音小程序滚动监听");
      // 抖音小程序需要使用页面事件
      const pageInstance = Taro.getCurrentInstance();
      if (pageInstance?.page?.onReachBottom) {
        // console.log("🔔 注册抖音onReachBottom事件");
        pageInstance.page.onReachBottom = () => {
          // console.log("🎯 抖音onReachBottom触发");
          handleReachBottom();
        };
      }
      return () => {
        // console.log("🧹 清理抖音小程序事件监听");
      };
    }
    // 京东小程序特殊处理
    else if (process.env.TARO_ENV === "jd") {
      // console.log("🛒 初始化京东小程序滚动监听");
      // 京东小程序需要使用页面事件
      const pageInstance = Taro.getCurrentInstance();
      if (pageInstance?.page?.onReachBottom) {
        // console.log("🔔 注册京东onReachBottom事件");
        pageInstance.page.onReachBottom = () => {
          // console.log("🎯 京东onReachBottom触发");
          handleReachBottom();
        };
      }
      return () => {
        // console.log("🧹 清理京东小程序事件监听");
      };
    }
    // 其他环境使用通用监听
    else {
      // console.log("🖱️ 初始化通用滚动监听");
      const scrollHandler = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        // console.log("📏 当前滚动位置:", {
        //   scrollTop,
        //   scrollHeight,
        //   clientHeight,
        //   distanceToBottom,
        // });
        if (distanceToBottom < 100) {
          handleReachBottom();
        }
      };

      window.addEventListener("scroll", scrollHandler);
      return () => {
        window.removeEventListener("scroll", scrollHandler);
      };
    }
  }, [loading, hasMore, handleScrollToLower]);

  return (
    <View className="waterfall-flow">
      <View className="waterfall-container">
        {data.map((item) => (
          <View
            key={item.id}
            className="waterfall-item"
            onClick={() => {
              Taro.redirectTo({
                url: `/pages/productDetail/index?id=${item.id}`,
              });
            }}
          >
            <View className="image-container">
            <Image
                src={ensureImageUrl(item.logo) || ''}
                mode="aspectFill"
                lazyLoad
                className="product-image"
                onLoad={() => console.log("Image loaded:", item.id)}
                onError={() => console.log("Image load error:", item.id)}
              />
              {/* 占位图 - 图片加载前显示 */}
              <View
                className="placeholder"
                style={{ height: `${placeholderHeight}px` }}
              />
            </View>
            <Text className="title">{item.name}</Text>
            <Text className="price">¥{item.salePrice}</Text>
          </View>
        ))}
        {loading && page === 1 ? (
          // 首屏加载时显示骨架屏
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`skeleton-${i}`} className="skeleton-item">
                <View
                  className="skeleton-image"
                  style={{ height: `${placeholderHeight}px` }}
                />
                <View className="skeleton-title" />
                <View className="skeleton-price" />
              </View>
            ))}
          </>
        ) : loading ? (
          <View className="loading-more">
            <Text>加载中...</Text>
          </View>
        ) : null}
        {!hasMore && (
          <View className="no-more">
            <Text>没有更多了</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default WaterfallFlow;
